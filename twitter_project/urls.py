from django.conf.urls import patterns, url

from twitter_project import views

urlpatterns = patterns(
    '',
    url(r'^$', views.index, name='index'),
    url(r'^process-url/$', views.processUrl, name='process_url'),
)
