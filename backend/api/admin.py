from django.contrib import admin
from .models import User, Quiz, Question, Attempt


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'created_at']
    search_fields = ['username', 'email']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'created_at']
    search_fields = ['title']
    list_filter = ['created_at']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'question_text', 'correct_answer', 'order']
    list_filter = ['quiz']
    search_fields = ['question_text']


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'total_questions', 'attempted_at']
    list_filter = ['attempted_at', 'quiz']
    search_fields = ['user__username', 'quiz__title']
