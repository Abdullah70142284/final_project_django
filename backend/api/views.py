from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Quiz, Attempt, Question
from .serializers import UserSerializer, QuizSerializer, AttemptSerializer


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Move user creation logic here
        User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    identifier = request.data.get('identifier')  # username or email
    password = request.data.get('password')
    
    if not identifier or not password:
        return Response({'error': 'Identifier and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Manually search for the user by username or email
    user = User.objects.filter(
        Q(username=identifier) | Q(email=identifier)
    ).first()
    
    # Check if user exists and verify hashed password
    if user and user.check_password(password):
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class QuizListCreate(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def perform_create(self, serializer):
        # Handle nested question creation logic in view
        questions_data = self.request.data.get('questions', [])
        quiz = serializer.save()
        
        for index, q_data in enumerate(questions_data):
            Question.objects.create(
                quiz=quiz,
                question_text=q_data.get('question_text'),
                options=q_data.get('options'),
                correct_answer=q_data.get('correct_answer'),
                order=q_data.get('order', index)
            )


class QuizDetail(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


class AttemptListCreate(generics.ListCreateAPIView):
    serializer_class = AttemptSerializer

    def get_queryset(self):
        attempts = Attempt.objects.all()
        
        # Filter by username
        username = self.request.query_params.get('username')
        if username:
            attempts = attempts.filter(user__username=username)
        
        # Filter by quiz title
        quiz_title = self.request.query_params.get('quiz_title')
        if quiz_title:
            attempts = attempts.filter(quiz__title__icontains=quiz_title)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        if start_date:
            attempts = attempts.filter(attempted_at__gte=start_date)
        
        end_date = self.request.query_params.get('end_date')
        if end_date:
            attempts = attempts.filter(attempted_at__lte=end_date)
        
        # Filter by minimum score percentage
        min_score = self.request.query_params.get('min_score')
        if min_score:
            min_score = float(min_score)
            filtered_ids = [
                attempt.id for attempt in attempts 
                if (attempt.score / attempt.total_questions) * 100 >= min_score
            ]
            attempts = attempts.filter(id__in=filtered_ids)
        
        return attempts
