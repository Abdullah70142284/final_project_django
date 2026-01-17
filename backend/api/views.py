from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import User, Quiz, Attempt
from .serializers import UserSerializer, QuizSerializer, AttemptSerializer


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    identifier = request.data.get('identifier')  # username or email
    password = request.data.get('password')
    
    if not identifier or not password:
        return Response({'error': 'Identifier and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.filter(
        Q(username=identifier) | Q(email=identifier),
        password=password
    ).first()
    
    if user:
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
def quiz_list(request):
    if request.method == 'GET':
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def quiz_detail(request, pk):
    try:
        quiz = Quiz.objects.get(pk=pk)
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = QuizSerializer(quiz)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def attempt_list(request):
    if request.method == 'GET':
        attempts = Attempt.objects.all()
        
        # Filter by username
        username = request.query_params.get('username')
        if username:
            attempts = attempts.filter(user__username=username)
        
        # Filter by quiz title
        quiz_title = request.query_params.get('quiz_title')
        if quiz_title:
            attempts = attempts.filter(quiz__title__icontains=quiz_title)
        
        # Filter by date range
        start_date = request.query_params.get('start_date')
        if start_date:
            attempts = attempts.filter(attempted_at__gte=start_date)
        
        end_date = request.query_params.get('end_date')
        if end_date:
            attempts = attempts.filter(attempted_at__lte=end_date)
        
        # Filter by minimum score percentage
        min_score = request.query_params.get('min_score')
        if min_score:
            min_score = float(min_score)
            filtered_attempts = []
            for attempt in attempts:
                percentage = (attempt.score / attempt.total_questions) * 100
                if percentage >= min_score:
                    filtered_attempts.append(attempt)
            attempts = filtered_attempts
        
        serializer = AttemptSerializer(attempts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AttemptSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
