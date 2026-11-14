import type { UiCopy } from '@bookio/ui';
import { m } from '../paraglide/messages.js';

export function buildUiCopy(): UiCopy {
    return {
        validationError: m.ui_validation_error(),
        removeFile: m.ui_remove_file(),
        fileDropPlaceholder: m.ui_file_drop(),
        fileSelectPlaceholder: m.ui_file_select(),
        fileTypeError: m.ui_file_type(),
        removeImage: m.ui_remove_image(),
        imageDropPlaceholder: m.ui_image_drop(),
        imageSelectPlaceholder: m.ui_image_select(),
        imageFileError: m.ui_image_file(),
        copy: m.ui_copy(),
        hide: m.ui_hide(),
        show: m.ui_show(),
        progressBar: m.ui_progress(),
        selectPlaceholder: m.ui_select(),
        searchPlaceholder: m.ui_search(),
        emptyOptions: m.ui_empty_options(),
        selectedCount: (count) => m.ui_selected_count({ count }),
        chooseTime: m.ui_choose_time(),
        closeTimePicker: m.ui_close_time(),
        openTimePicker: m.ui_open_time(),
        hours: m.ui_hours(),
        minutes: m.ui_minutes(),
        previousMonth: m.ui_prev_month(),
        nextMonth: m.ui_next_month(),
        previousYear: m.ui_prev_year(),
        nextYear: m.ui_next_year(),
        chooseDate: m.ui_choose_date(),
        closeDatePicker: m.ui_close_date(),
        openDatePicker: m.ui_open_date(),
        chooseColor: m.ui_choose_color(),
        hexColor: m.ui_hex(),
    };
}
