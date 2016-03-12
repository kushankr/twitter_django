from django.shortcuts import render
from django.http import JsonResponse

from forms import InputURLForm


def index(request):
    data = {}
    if request.method == 'POST':
        form = InputURLForm(request.POST)
        if form.is_valid():
            input_url = form.cleaned_data['input_url']
            data['input_url'] = input_url
            return JsonResponse(data)
    else:
        form = InputURLForm()

    return render(
        request,
        'twitter_project/index.html',
        {'form': form}
    )
