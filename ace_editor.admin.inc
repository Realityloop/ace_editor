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

		$current_theme = variable_get('ace_editor_theme', 'dark');
		$form['ace_editor_theme'] = array(
			'#title' => 'Editor theme',
			'#type' => 'select',
			'#options' => array(
				'dark' => 'Dark',
				'light' => 'Light',
			),
			'#default_value' => array($current_theme),
			'#attributes' => array(
				'style' => 'min-width: 400px;'
			),
		);

		$form['ace_editor_font_size'] = array(
			'#type' => 'select',
			'#title' => t('Font size'),
			'#options' => array(
				'9pt' => '9pt',
				'10pt' => '10pt',
				'11pt' => '11pt',
				'12pt' => '12pt',
			),
			'#default_value' => variable_get('ace_editor_font_size', '10pt'),
			'#attributes' => array(
				'style' => 'min-width: 100px;'
			),
		);

		$form['ace_editor_print_margin'] = array(
			'#type' => 'checkbox',
			'#title' => t('Show print margin'),
			'#default_value' => variable_get('ace_editor_print_margin'),
		);

		return system_settings_form($form);
	}


