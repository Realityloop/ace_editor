/*
 *  JS processing for the Ace Editor field formatter (read-only output)
 */
(function($) {
  Drupal.behaviors.ace_editor_field_format = {
    attach: function(context, settings) {
      if (Drupal.settings.ace_editor.editor_instances.length) {
        $(Drupal.settings.ace_editor.editor_instances).each(function(i) {
          var $pre = $('#' + this['id']);
          var html = this['content'];
          var settings = this['settings'];

          var SyntaxMode = ace.require("ace/mode/" + settings['syntax']).Mode;
          var themePath = "ace/theme/" + settings['theme'];
          var langTools = ace.require("ace/ext/language_tools");

          var editor_instance = ace.edit(this['id']);
          editor_instance.getSession().setMode(new SyntaxMode());
          editor_instance.setTheme(themePath);
          editor_instance.setReadOnly(true);

          // Formatter options:
          // wrapmode breaks the read-only editor if activated
//          editor_instance.getSession().setUseWrapMode(settings['autowrap']);
          editor_instance.getSession().setUseWrapMode(false);
          editor_instance.setHighlightActiveLine(settings['linehighlighting']);
          editor_instance.renderer.setShowGutter(settings['line_numbers']);

          editor_instance.renderer.setHScrollBarAlwaysVisible(false);

          $pre.css({
             'font-size': settings['font_size'],
             'width': settings['width']
          });

          //We need to put the content to calculate the height
          editor_instance.getSession().setValue(html);

          //Deal with the height.
          var height = settings['height'];

          //If auto.
          if ( height.toLowerCase() == 'auto') {
            // The height is number of lines * line height + height on the
            // scrollbar (if needed) + 5px (to keep everything less squished).
            //  As far as I know, there is no way of knowing if the scrollbar
            // is present or not because Ace hasn't rendered the editor yet.
            // So, we're going to create our own <span> with the content in it,
            // hide it, and check if it fits in the PRE.

            //Create the hidden span, append it to the PRE
            // and get its width with nowrap.
            var content_width = $('<span></span>').
                  attr('id', 'ace_editor_to_remove').
                  css({display:'none',whiteSpace:'nowrap'}).
                  appendTo($('#'+editor_instance.container.id)).
                  text(editor_instance.getSession().getValue()).width();

            $('#ace_editor_to_remove').remove(); //It's now useless, remove it.
            //We HAVE to re-take the width because it can be set in % in the config.
            var pre_width = $('#'+editor_instance.container.id).width();

            if (content_width > pre_width) {
              $pre.css('height', ((editor_instance.renderer.lineHeight) *
                  (editor_instance.getSession().getValue().split('\n').length) +
                   editor_instance.renderer.scrollBarH.height) + 5);
            }
            else {
              $pre.css('height', ((editor_instance.renderer.lineHeight) *
                  (editor_instance.getSession().getValue().split('\n').length))
                  + 5);
            }
          }
          else {
            $pre.css('height', height);
          }
        });
      }
    }
  };
})(jQuery);
