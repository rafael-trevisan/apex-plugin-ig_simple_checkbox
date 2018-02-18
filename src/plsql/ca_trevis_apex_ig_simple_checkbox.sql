--------------------------------------------------------------------------------
-- Render Procedure
--------------------------------------------------------------------------------
procedure render_ig_simple_checkbox (
  p_item   in            apex_plugin.t_item,
  p_plugin in            apex_plugin.t_plugin,
  p_param  in            apex_plugin.t_item_render_param,
  p_result in out nocopy apex_plugin.t_item_render_result
)
is
  c_name            constant varchar2(30)    := apex_plugin.get_input_name_for_item;
  c_escaped_value   constant varchar2(32767) := apex_escape.html_attribute(p_param.value);
  c_checked_value   constant varchar2(32767) := nvl(p_item.attribute_01, 1);
  c_unchecked_value constant varchar2(32767) := nvl(p_item.attribute_02, 0);
begin
  if p_param.is_readonly or p_param.is_printer_friendly then
    apex_plugin_util.print_hidden_if_readonly (
      p_item_name           => p_item.name,
      p_value               => p_param.value,
      p_is_readonly         => p_param.is_readonly,
      p_is_printer_friendly => p_param.is_printer_friendly
    );

    sys.htp.prn(
      apex_string.format(
        '<input type="text" %s id="%s" value="%s"/>'
        , apex_plugin_util.get_element_attributes(p_item, p_item.name, 'apex-item-igsimplecheckbox apex-item-plugin')
        , p_item.name|| '_DISPLAY'
        , case when p_param.value is null then '' else ltrim( rtrim ( c_escaped_value ) ) end
      )
    );
  else
    sys.htp.prn(
      apex_string.format(
        '<input type="text" %s id="%s" value="%s"/>'
        , apex_plugin_util.get_element_attributes(p_item, p_item.name, 'apex-item-igsimplecheckbox apex-item-plugin')
        , p_item.name
        , case when p_param.value is null then '' else ltrim( rtrim ( c_escaped_value ) ) end
      )
    );

    apex_javascript.add_onload_code (
      p_code => apex_string.format(
                  'ca_trevis_apex_ig_simple_checkbox.init("%s", {readOnly: %s, checkedValue: "%s", uncheckedValue: "%s", isRequired: %s});'
                  , case when p_param.is_readonly or p_param.is_printer_friendly then p_item.name || '_DISPLAY' else p_item.name end
                  , case when p_param.is_readonly then 'true' else 'false' end
                  , c_checked_value
                  , c_unchecked_value
                  , case when p_item.is_required then 'true' else 'false' end
                )
    );
  end if;

  p_result.is_navigable := (not p_param.is_readonly = false and not p_param.is_printer_friendly);
end render_ig_simple_checkbox;

--------------------------------------------------------------------------------
-- Meta Data Procedure
--------------------------------------------------------------------------------
procedure metadata_ig_simple_checkbox (
  p_item   in            apex_plugin.t_item,
  p_plugin in            apex_plugin.t_plugin,
  p_param  in            apex_plugin.t_item_meta_data_param,
  p_result in out nocopy apex_plugin.t_item_meta_data_result )
is
begin
  p_result.escape_output := false;
end metadata_ig_simple_checkbox;

--------------------------------------------------------------------------------
-- Validation Procedure
--------------------------------------------------------------------------------
procedure validate_ig_simple_checkbox (
  p_item   in            apex_plugin.t_item,
  p_plugin in            apex_plugin.t_plugin,
  p_param  in            apex_plugin.t_item_validation_param,
  p_result in out nocopy apex_plugin.t_item_validation_result )
is
  c_checked_value   constant varchar2(32767) := nvl(p_item.attribute_01, 1);
  c_unchecked_value constant varchar2(32767) := nvl(p_item.attribute_02, 0);
begin
  if not (p_param.value in (c_checked_value, c_unchecked_value)
          or (p_param.value is null and c_unchecked_value is null)
         )
  then
    p_result.message := 'Checkbox contains invalid value!';
  end if;
end validate_ig_simple_checkbox;
