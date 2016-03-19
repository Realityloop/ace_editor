<?php

  /**
   * Implements hook_form().
   *
   * Settings form to configure the module.
   */
  function ace_editor_settings_form($form, &$form_state) {
    $form = array();

    $filter_formats = filter_formats();
    $filter_formats_options = array();
    foreach($filter_formats as $key => $format_obj) {
      $filter_formats_options[$key] = $format_obj->name;
    }

    $form['explanation'] = array(
      '#markup' => t('Select the default behaviours for the Ace editor.<br>'),
    );

    $form['ace_editor_filter_formats'] = array(
      '#type' => 'select',
      '#title' => t('Text formats'),
      '#description' => t('Select the text formats that will be using the editor.'),
      '#multiple' => TRUE,
      '#options' => $filter_formats_options,
      '#default_value' => variable_get('ace_editor_filter_formats', array()),
      '#size' => count($filter_formats_options),
      '#attributes' => array(
        'style' => 'min-width: 400px; margin-top: 10px;'
      ),
    );

    $form['ace_editor_theme'] = array(
      '#title' => 'Editor theme',
      '#type' => 'select',
      '#description' => 'You can check the availables themes <a href="'.
        'http://ace.c9.io/build/kitchen-sink.html" target="_blank">here.</a>',
      '#options' => ace_editor_get_themes(),
      '#default_value' => variable_get('ace_editor_theme', 'twilight'),
      '#attributes' => array(
        'style' => 'min-width: 400px;'
      ),
    );

    $form['ace_editor_default_syntax'] = array(
      '#title' => 'Editor default syntax',
      '#type' => 'select',
      '#options' => ace_editor_get_modes(),
      '#default_value' => variable_get('ace_editor_default_syntax', 'html'),
      '#attributes' => array(
        'style' => 'min-width: 400px;'
      ),
    );

    $form['ace_editor_fontsize'] = array(
      '#type' => 'select',
      '#title' => t('Font size'),
      '#options' => array(
        '8pt' => '8pt',
        '9pt' => '9pt',
        '10pt' => '10pt',
        '11pt' => '11pt',
        '12pt' => '12pt',
        '13pt' => '13pt',
        '14pt' => '14pt',
      ),
      '#default_value' => variable_get('ace_editor_fontsize', '10pt'),
      '#attributes' => array(
        'style' => 'min-width: 75px;'
      ),
    );

    $form['ace_editor_printmargin'] = array(
      '#type' => 'checkbox',
      '#title' => t('Show print margin'),
      '#default_value' => variable_get('ace_editor_printmargin'),
    );

    $form['ace_editor_autowrap'] = array(
      '#type' => 'checkbox',
      '#title' => t('Autowrap lines'),
      '#default_value' => variable_get('ace_editor_autowrap'),
    );

    $form['ace_editor_linehighlighting'] = array(
      '#type' => 'checkbox',
      '#title' => t('Line highlighting'),
      '#default_value' => variable_get('ace_editor_linehighlighting'),
    );

    $form['ace_editor_codefolding'] = array(
      '#type' => 'select',
      '#title' => t('Code folding'),
      '#options' => array(
        'manual' => 'disabled',
        'markbegin' => 'mark begin',
        'markbeginend' => 'mark begin and end',
      ),
      '#default_value' => variable_get('ace_editor_codefolding', 'markbegin'),
    );

    $form['ace_editor_tabsize'] = array(
      '#type' => 'select',
      '#title' => t('Tab size'),
      '#options' => array(
        1 => 1,
        2 => 2,
        3 => 3,
        4 => 4,
        5 => 5,
        6 => 6,
        7 => 7,
        8 => 8),
      '#default_value' => variable_get('ace_editor_tabsize', 2),
      '#attributes' => array(
        'style' => 'min-width: 75px;'
      ),
    );

    return system_settings_form($form);
  }


