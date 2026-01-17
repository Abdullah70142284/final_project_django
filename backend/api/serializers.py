from rest_framework import serializers
from .models import User, Quiz, Question, Attempt


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_answer', 'order']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions', 'created_by', 'created_at']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        
        for question_data in questions_data:
            # Use the order from question_data if provided, otherwise use index
            if 'order' not in question_data:
                question_data['order'] = 0
            Question.objects.create(quiz=quiz, **question_data)
        
        return quiz


class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Attempt
        fields = ['id', 'user', 'username', 'quiz', 'quiz_title', 'score', 'total_questions', 'selected_answers', 'attempted_at']
        read_only_fields = ['attempted_at']
