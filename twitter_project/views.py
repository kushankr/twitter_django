from django.shortcuts import render
from django.http import JsonResponse

from forms import InputURLForm
import requests

# https://docs.djangoproject.com/en/1.9/topics/forms/
def index(request):
    data = {}
    if request.method == 'POST':
        form = InputURLForm(request.POST)
        if form.is_valid():
            input_url = form.cleaned_data['input_url']
            data['input_url'] = input_url
            try:
                response = requests.get(input_url, verify=False)
            except requests.exceptions.RequestException as e:
                data['error'] = 'Connection Failed!'
            else:
                data['html'] = response.text
            return JsonResponse(data)
    else:
        form = InputURLForm()

    return render(
        request,
        'twitter_project/index.html',
        {'form': form}
    )
