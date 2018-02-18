/**
 * @author Rafael Trevisan <rafael@trevis.ca>
 * @license
 * Copyright (c) 2018 Rafael Trevisan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following players:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* global apex */

const init = (itemId, options) => {
  const { checkedValue, uncheckedValue, readOnly } = options;
  let index = 0;
  const item$ = $(`#${itemId}`);
  const sr$ = item$.addClass('u-vh is-focusable')
    .wrap('<div class="ig-simple-checkbox ig-simple-checkbox-item ig-simple-checkbox-enabled"></div>')
    .parent();

  const render = (full, value) => {
    const out = apex.util.htmlBuilder();
    out.markup('<div')
      .attr('class', 'ig-simple-checkbox checkbox_group apex-item-checkbox')
      .markup('><input')
      .attr('type', 'checkbox')
      .attr('id', `${itemId}_${index}_0`)
      .attr('name', `${itemId}_${index}`)
      .attr('value', value)
      .attr('data-checked-value', checkedValue)
      .attr('data-unchecked-value', uncheckedValue)
      .optionalAttr('checked', value === checkedValue)
      .optionalAttr('disabled', readOnly)
      .markup(' /><label')
      .attr('for', `${itemId}_${index}_0`)
      .markup('>')
      .content('')
      .markup('</label>');

    index += 1;

    return out.toString();
  };

  const updateDisplay = () => {
    const checkbox$ = sr$.find('input[type="checkbox"]');
    checkbox$.prop('checked', item$.val() === checkedValue);
  };

  sr$.append(render());

  sr$.find('input[type="checkbox"]').on('change', (e) => {
    const checkbox$ = $(e.currentTarget);
    item$.val(checkbox$.prop('checked') ? checkedValue : uncheckedValue).change();

    const rowId = checkbox$.closest('tr').data('id');
    const regionId = $(checkbox$.parents('.a-IG')).attr('id').slice(0, -3);
    const ig$ = apex.region(regionId).widget();
    const { model } = ig$.interactiveGrid('getViews', 'grid');
    const record = model.getRecord(rowId);
    const fields = ig$.interactiveGrid('getViews').grid.model.getOption('fields');
    let field = '';
    Object.keys(fields).forEach((el) => {
      if (fields[el].elementId === itemId) {
        field = el;
      }
    });

    model.setValue(record, field, item$.val());

    item$.focus();
  });

  sr$.on('focusin', () => {
    $(this).addClass('is-focused');
  }).on('focusout', () => {
    $(this).removeClass('is-focused');
  });

  updateDisplay();

  if (options.readOnly) {
    item$.closest('.ig-simple-checkbox').removeClass('ig-simple-checkbox-disabled');
    item$.closest('.ig-simple-checkbox').addClass('ig-simple-checkbox-enabled');
  }

  apex.item.create(itemId, {
    setValue(value) {
      item$.val(value);
      updateDisplay();
    },
    disable() {
      item$.closest('.ig-simple-checkbox').addClass('ig-simple-checkbox-disabled');
      item$.closest('.ig-simple-checkbox').removeClass('ig-simple-checkbox-enabled');
      item$.prop('disabled', true);
    },
    enable() {
      if (!options.readOnly) {
        item$.closest('.ig-simple-checkbox').removeClass('ig-simple-checkbox-disabled');
        item$.closest('.ig-simple-checkbox').addClass('ig-simple-checkbox-enabled');
        item$.prop('disabled', false);
      }
    },
    displayValueFor(value) {
      return render(true, value);
    },
  });
};

export {
  init, // eslint-disable-line import/prefer-default-export
};
