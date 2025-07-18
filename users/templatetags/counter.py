from django import template
register = template.Library()


@register.simple_tag
def set(val=None):
  return val


@register.simple_tag
def add(val=None):
    return (val + 1)


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)