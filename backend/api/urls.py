from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('users/signup/', views.signup, name='signup'),
    path('users/login/', views.login, name='login'),
    
    # Quiz endpoints
    path('quizzes/', views.QuizListCreate.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', views.QuizDetail.as_view(), name='quiz-detail'),
    
    # Attempt endpoints
    path('attempts/', views.AttemptListCreate.as_view(), name='attempt-list'),
]
