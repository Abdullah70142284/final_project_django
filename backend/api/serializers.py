from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quiz, Question, Attempt


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_answer', 'order']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions', 'created_by', 'created_at']


class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Attempt
        fields = ['id', 'user', 'username', 'quiz', 'quiz_title', 'score', 'total_questions', 'selected_answers', 'attempted_at']
        read_only_fields = ['attempted_at']
