(function($) {

  Drupal.behaviors.ace_editor_field_format = {
	attach: function(context, settings) {
		
		if (Drupal.settings.ace_editor.editor_instances.length) {
			
			$(Drupal.settings.ace_editor.editor_instances).each(function(i) {
				var $pre = $('#' + this['id']);
				var html = this['content'];
				var settings = this['settings'];
				
				var SyntaxMode = require("ace/mode/" + settings['syntax']).Mode;
				var themePath = "ace/theme/" + settings['theme'];
			
				var editor_instance = ace.edit(this['id']);
				editor_instance.getSession().setMode(new SyntaxMode());
				editor_instance.setTheme(themePath);
				editor_instance.renderer.setShowGutter(settings['line_numbers']);
				editor_instance.setShowPrintMargin(settings['print_margin']);
				editor_instance.setShowInvisibles(settings['invisibles']);
				editor_instance.setReadOnly(true);
				$pre.css({
					'font-size': settings['font_size'],
					'height': settings['field_height'],
					'width': settings['field_width']
				});
			
				// Set the height of the editor if field_height is set to auto.	
				/*if (settings['field_height'] == 'auto') {
					editor_instance.getSession().on('change', function(e) {
						//var cursorHeight = $pre.find('div.ace_gutter-cell:first').css('height');
						//alert(cursorHeight);
						//$pre.css('height', (editor_instance.getSession().getValue().split('\n').length + 2) * cursorHeight);
						
					});
				}*/
			
				editor_instance.getSession().setValue(html);
			});
		}
		
		
	}
  };

})(jQuery);
