from unfold.admin import ModelAdmin

# Register your models here.
class CategoryAdmin(ModelAdmin):
    list_display = ('name', 'active', 'created_date')
    search_fields = ('name',)

    list_per_page = 12

    list_editable = ('active',)
    list_filter = ['active', 'created_date']
