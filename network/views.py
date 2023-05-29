from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User, Post, Like


def index(request):
    return render(request, "network/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

# put data here throught fetch put method

def post(request):

    #post = request["postContent"]

    if request.method == "GET":
        # return JsonResponse({"response": "Must use post request."}, status=400)
        posts = Post.objects.all()
        # https://www.w3schools.com/django/django_queryset_orderby.php
        posts = posts.order_by("-datetime").all()
        # look at project mail for some help
        # https://www.google.com/search?q=JsonResponse+safe+parameter+python&oq=JsonResponse+safe+parameter+python&aqs=chrome..69i57.7838j0j7&sourceid=chrome&ie=UTF-8d
        # https://machinelearningmastery.com/a-gentle-introduction-to-serialization-for-python/#:~:text=Serialization%20refers%20to%20the%20process,the%20reverse%20process%20of%20deserialization.

        # if you want to serialize, you have to define serialize function for the class (e.g our model)
        return JsonResponse([post.serialize() for post in posts], safe=False)
    else:
        data = json.loads(request.body)
        post = data.get("postContent")
        # post = request.POST["postContent"]
        # return JsonResponse({"response": post})
        
        curr_user = User.objects.get(id=request.user.id)
        new_post = Post(content=post, user=curr_user)
        new_post.save()

        return JsonResponse({"response": "Success"}, status=201)

def user_posts(request):

    users_posts = Post.objects.filter(user=request.user)
    return JsonResponse([post.serialize for post in users_posts], safe=False)
