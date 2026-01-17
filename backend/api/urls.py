from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('users/signup/', views.signup, name='signup'),
    path('users/login/', views.login, name='login'),
    
    # Quiz endpoints
    path('quizzes/', views.quiz_list, name='quiz-list'),
    path('quizzes/<int:pk>/', views.quiz_detail, name='quiz-detail'),
    
    # Attempt endpoints
    path('attempts/', views.attempt_list, name='attempt-list'),
]
