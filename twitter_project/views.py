from django.http import HttpResponseRedirect
from django.shortcuts import render

from forms import InputURLForm


def index(request):
    return render(request, 'twitter_project/index.html')


def processUrl(request):
    if request.method == 'POST':
        form = InputURLForm(request.POST)
        if form.is_valid():
            input_url = form.cleaned_data['input_url']
            return HttpResponseRedirect(
                '/twitter_project/'
                )
    else:
        form = InputURLForm()

    return render(
        request,
        'twitter_project/index.html',
        {'form': form}
    )
