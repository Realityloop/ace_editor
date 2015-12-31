<?php

/*
 *  Devel console submission handler
 */
function ace_editor_execute_form_submit($form, &$form_state){

  // Remove php tags before submission to Devel module
  if (strpos($form_state['values']['code'],'<?php') !== FALSE) {
      $value = $form_state['values']['code'];
      $value = preg_replace('/<\?php/','',$value);
      $form_state['values']['code'] = $value;
  }
  if (strpos($form_state['values']['code'],'<?') !== FALSE) {
      $value = $form_state['values']['code'];
      $value = preg_replace('/<\?/','',$value);
      $form_state['values']['code'] = $value;
  }

  print eval($form_state['values']['code']);

  // Restore the textarea content
  $_SESSION['devel_execute_code'] = $form_state['values']['code'];
}
