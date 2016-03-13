from django.test import TestCase
from django.test.client import Client


class URLFormTests(TestCase):
    def setup(self):
        self.client = Client()

    def test_form_no_value(self):
        response = self.client.post(
            '/twitter_project/',
            {'input_url': ''},
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
            )
        self.assertContains(
            response,
            'This field is required.'
            )

    def test_form_invalid_value(self):
        response = self.client.post(
            '/twitter_project/',
            {'input_url': 'ko.'},
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
            )
        self.assertContains(
            response,
            'Enter a valid URL.'
            )

    def test_form_valid_value(self):
        response = self.client.post(
            '/twitter_project/',
            {'input_url': 'twitter.com/kushankraghav'},
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
            )
        self.assertContains(
            response,
            'http://twitter.com/kushankraghav'
            )
