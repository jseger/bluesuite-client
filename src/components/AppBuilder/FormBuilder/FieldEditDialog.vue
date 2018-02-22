<template>
  <v-dialog v-model="dialog">
    <v-btn slot="activator"
      color="blue darken-2" flat icon>
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <v-flex xs12>
          <v-text-field
          label="Label"
          required
          v-model="editField.label"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
          label="Database Field Name (camelCase without spaces)"
          required
          v-model="editField.name" v-if="editField.type !== 'label'"></v-text-field>
        </v-flex>
        <v-checkbox 
        label="Required"
        v-model="editField.required" v-if="editField.type !== 'label'"></v-checkbox>
        <v-checkbox 
        label="Show Preview"
        v-model="editField.preview" 
        v-if="editField.type === 'image'"></v-checkbox>
        <v-checkbox 
        v-if="editField.type === 'text'"
        label="Multiline"
        v-model="editField.multiLine"></v-checkbox>
        <v-text-field
        label="Prefix"
        v-model="editField.prefix"
        v-if="['text', 'number'].includes(editField.type)"></v-text-field>
        <v-text-field
        label="Suffix"
        v-model="editField.suffix"
        v-if="['text', 'number'].includes(editField.type)"></v-text-field>
        <v-select
        chips
        tags
        solo
        prepend-icon="radio_button_checked"
        append-icon=""
        clearable
        v-model="editField.options"
        v-if="['radio', 'select'].includes(editField.type)"
        >
        <template slot="selection" slot-scope="data">
          <v-chip
            close
            @input="removeOption(field, data.item)"
            :selected="data.selected"
          >
            <strong>{{ data.item }}</strong> 
          </v-chip>
        </template>
        </v-select>
        <v-checkbox 
        v-if="['select', 'lookup'].includes(editField.type)"
        label="Allow Mutliple Selections"
        v-model="editField.multiple"></v-checkbox>
        <v-checkbox 
        v-if="editField.type === 'radio'"
        label="Horizontal"
        v-model="editField.horizontal"></v-checkbox>
        <v-select
        label="Select Data to Lookup"
        :items="lookupItems"
        required
        autocomplete v-if="editField.type === 'lookup'"
        v-model="editField.lookupItem"></v-select>
        <v-card v-if="editField.type == 'table'">
          <v-card-title>
            <v-btn @click="addColumn()">
              Add Column
              <v-icon left>add</v-icon>
            </v-btn>
          </v-card-title>
          <draggable element="v-layout" row wrap
                v-model="tableColumns" 
                :options="{group: {name: 'tableColumns'}}" 
                style="min-height: 100px"
                class="mb-5">
                <v-flex v-for="(column, i) in tableColumns" :key="column._id" xs12 class="ma-3">
                  <v-layout row wrap>
                  <v-flex xs3 class="pa-1">
                    <v-text-field
                      label="Header"
                      v-model="column.label"></v-text-field>
                      <v-text-field
                      label="Database Field Name"
                      v-model="column.name"></v-text-field>
                      <v-select label="Column Type" :items="columnTypes" v-model="column.columnType"></v-select>
                  </v-flex>
                  <v-flex xs4 class="pa-1">
                    <v-checkbox 
                        label="Required"
                        v-model="column.required"></v-checkbox>
                      <v-radio-group label="Alignment" v-model="column.alignText" :mandatory="true" row>
                        <v-radio label="Left" value="text-xs-left"></v-radio>
                        <v-radio label="Center" value="text-xs-center"></v-radio>
                        <v-radio label="Right" value="text-xs-right"></v-radio>
                      </v-radio-group>
                    <v-text-field
                      label="Prefix"
                      v-model="column.prefix"
                      v-if="['text', 'number'].includes(column.columnType)"></v-text-field>
                      <v-text-field
                      label="Suffix"
                      v-model="column.suffix"
                      v-if="['text', 'number'].includes(column.columnType)"></v-text-field>
                      <v-select
                      label="Options"
                      chips
                      tags
                      solo
                      prepend-icon="radio_button_checked"
                      append-icon=""
                      clearable
                      v-model="column.options" v-if="column.columnType === 'select'">
                      <template slot="selection" slot-scope="data">
                        <v-chip
                          close
                          @input="removeOption(field, data.item)"
                          :selected="data.selected"
                        >
                          <strong>{{ data.item }}</strong> 
                        </v-chip>
                      </template>
                      </v-select>
                  </v-flex>
                  <v-flex xs4 class="pa-1">
                    <v-text-field
                      label="Script function(item)"
                      v-model="column.calculation" multi-line></v-text-field>
                  </v-flex>
                  <v-flex xs1 class="text-xs-right">
                    <v-btn @click="removeColumn(i)" flat icon color="error">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-flex>                  
                  </v-layout>
                  <v-divider></v-divider>
                </v-flex>
          </draggable>
        </v-card>
        <v-select
        label="Select Child List Items"
        :items="lookupItems"
        required
        autocomplete v-if="editField.type === 'list'"
        v-model="editField.lookupItemForm"></v-select>
        <v-select
        label="Select Fields to Lookup"
        :items="editField.lookupItemFields"
        required
        multiple
        autocomplete 
        v-if="editField.type === 'lookup' && editField.lookupItem"
        v-model="editField.lookupItemFields"></v-select>
        <v-select
        label="Select Child List Columns"
        :items="lookupItemFields"
        required
        multiple
        autocomplete v-if="editField.type === 'list' && editField.lookupItemForm"
        v-model="editField.lookupItemFormFields"></v-select>
        <v-radio-group label="Label Type" v-model="editField.labelColor" v-if="editField.type === 'label'">
          <v-radio label="Blue" value="info"></v-radio>
          <v-radio label="Green" value="success" ></v-radio>
          <v-radio label="Orange" value="warning"></v-radio>
          <v-radio label="Red" value="error"></v-radio>
        </v-radio-group>
        <v-layout row>
        <v-flex xs2>
          <v-select
          label="Select Icon"
          :items="icons"
          clearable
          autocomplete v-if="editField.type === 'label'"
          v-model="editField.labelIcon"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-btn v-if="editField.labelIcon" flat><v-icon>{{editField.labelIcon}}</v-icon></v-btn>
        </v-flex>
        </v-layout>
        <v-select
        label="Select Width"
        :items="widths"
        item-text="width"
        item-value="class"
        required
        v-model="editField.width"></v-select>
        <v-text-field
          label="Script function(item)"
          v-model="editField.calculation" multi-line v-if="field.type !== 'label'"></v-text-field>
        <v-layout row>
        <v-flex xs11>
        <v-btn @click="ok()" color="primary">OK</v-btn>
        <v-btn @click="cancel()">Cancel</v-btn>
        </v-flex>
        <v-flex xs1>
        <v-btn @click="removeField()" color="error">Remove Field</v-btn>
        </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    </v-dialog>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
Vue.use(draggable)

export default {
  props: ['field', 'index'],
  data () {
    return {
      editField: null,
      tableColumns: [],
      dialog: false,
      columnTypes: ['text', 'number', 'checkbox', 'select', 'lookup'],
      icons: ['3d_rotation', 'ac_unit', 'access_alarm', 'access_alarms', 'access_time', 'accessibility', 'accessible', 'account_balance', 'account_balance_wallet', 'account_box', 'account_circle', 'adb', 'add', 'add_a_photo', 'add_alarm', 'add_alert', 'add_box', 'add_circle', 'add_circle_outline', 'add_location', 'add_shopping_cart', 'add_to_photos', 'add_to_queue', 'adjust', 'airline_seat_flat', 'airline_seat_flat_angled', 'airline_seat_individual_suite', 'airline_seat_legroom_extra', 'airline_seat_legroom_normal', 'airline_seat_legroom_reduced', 'airline_seat_recline_extra', 'airline_seat_recline_normal', 'airplanemode_active', 'airplanemode_inactive', 'airplay', 'airport_shuttle', 'alarm', 'alarm_add', 'alarm_off', 'alarm_on', 'album', 'all_inclusive', 'all_out', 'android', 'announcement', 'apps', 'archive', 'arrow_back', 'arrow_downward', 'arrow_drop_down', 'arrow_drop_down_circle', 'arrow_drop_up', 'arrow_forward', 'arrow_upward', 'art_track', 'aspect_ratio', 'assessment', 'assignment', 'assignment_ind', 'assignment_late', 'assignment_return', 'assignment_returned', 'assignment_turned_in', 'assistant', 'assistant_photo', 'attach_file', 'attach_money', 'attachment', 'audiotrack', 'autorenew', 'av_timer', 'backspace', 'backup', 'battery_alert', 'battery_charging_full', 'battery_full', 'battery_std', 'battery_unknown', 'beach_access', 'beenhere', 'block', 'bluetooth', 'bluetooth_audio', 'bluetooth_connected', 'bluetooth_disabled', 'bluetooth_searching', 'blur_circular', 'blur_linear', 'blur_off', 'blur_on', 'book', 'bookmark', 'bookmark_border', 'border_all', 'border_bottom', 'border_clear', 'border_color', 'border_horizontal', 'border_inner', 'border_left', 'border_outer', 'border_right', 'border_style', 'border_top', 'border_vertical', 'branding_watermark', 'brightness_1', 'brightness_2', 'brightness_3', 'brightness_4', 'brightness_5', 'brightness_6', 'brightness_7', 'brightness_auto', 'brightness_high', 'brightness_low', 'brightness_medium', 'broken_image', 'brush', 'bubble_chart', 'bug_report', 'build', 'burst_mode', 'business', 'business_center', 'cached', 'cake', 'call', 'call_end', 'call_made', 'call_merge', 'call_missed', 'call_missed_outgoing', 'call_received', 'call_split', 'call_to_action', 'camera', 'camera_alt', 'camera_enhance', 'camera_front', 'camera_rear', 'camera_roll', 'cancel', 'card_giftcard', 'card_membership', 'card_travel', 'casino', 'cast', 'cast_connected', 'center_focus_strong', 'center_focus_weak', 'change_history', 'chat', 'chat_bubble', 'chat_bubble_outline', 'check', 'check_box', 'check_box_outline_blank', 'check_circle', 'chevron_left', 'chevron_right', 'child_care', 'child_friendly', 'chrome_reader_mode', 'class', 'clear', 'clear_all', 'close', 'closed_caption', 'cloud', 'cloud_circle', 'cloud_done', 'cloud_download', 'cloud_off', 'cloud_queue', 'cloud_upload', 'code', 'collections', 'collections_bookmark', 'color_lens', 'colorize', 'comment', 'compare', 'compare_arrows', 'computer', 'confirmation_number', 'contact_mail', 'contact_phone', 'contacts', 'content_copy', 'content_cut', 'content_paste', 'control_point', 'control_point_duplicate', 'copyright', 'create', 'create_new_folder', 'credit_card', 'crop', 'crop_16_9', 'crop_3_2', 'crop_5_4', 'crop_7_5', 'crop_din', 'crop_free', 'crop_landscape', 'crop_original', 'crop_portrait', 'crop_rotate', 'crop_square', 'dashboard', 'data_usage', 'date_range', 'dehaze', 'delete', 'delete_forever', 'delete_sweep', 'description', 'desktop_mac', 'desktop_windows', 'details', 'developer_board', 'developer_mode', 'device_hub', 'devices', 'devices_other', 'dialer_sip', 'dialpad', 'directions', 'directions_bike', 'directions_boat', 'directions_bus', 'directions_car', 'directions_railway', 'directions_run', 'directions_subway', 'directions_transit', 'directions_walk', 'disc_full', 'dns', 'do_not_disturb', 'do_not_disturb_alt', 'do_not_disturb_off', 'do_not_disturb_on', 'dock', 'domain', 'done', 'done_all', 'donut_large', 'donut_small', 'drafts', 'drag_handle', 'drive_eta', 'dvr', 'edit', 'edit_location', 'eject', 'email', 'enhanced_encryption', 'equalizer', 'error', 'error_outline', 'euro_symbol', 'ev_station', 'event', 'event_available', 'event_busy', 'event_note', 'event_seat', 'exit_to_app', 'expand_less', 'expand_more', 'explicit', 'explore', 'exposure', 'exposure_neg_1', 'exposure_neg_2', 'exposure_plus_1', 'exposure_plus_2', 'exposure_zero', 'extension', 'face', 'fast_forward', 'fast_rewind', 'favorite', 'favorite_border', 'featured_play_list', 'featured_video', 'feedback', 'fiber_dvr', 'fiber_manual_record', 'fiber_new', 'fiber_pin', 'fiber_smart_record', 'file_download', 'file_upload', 'filter', 'filter_1', 'filter_2', 'filter_3', 'filter_4', 'filter_5', 'filter_6', 'filter_7', 'filter_8', 'filter_9', 'filter_9_plus', 'filter_b_and_w', 'filter_center_focus', 'filter_drama', 'filter_frames', 'filter_hdr', 'filter_list', 'filter_none', 'filter_tilt_shift', 'filter_vintage', 'find_in_page', 'find_replace', 'fingerprint', 'first_page', 'fitness_center', 'flag', 'flare', 'flash_auto', 'flash_off', 'flash_on', 'flight', 'flight_land', 'flight_takeoff', 'flip', 'flip_to_back', 'flip_to_front', 'folder', 'folder_open', 'folder_shared', 'folder_special', 'font_download', 'format_align_center', 'format_align_justify', 'format_align_left', 'format_align_right', 'format_bold', 'format_clear', 'format_color_fill', 'format_color_reset', 'format_color_text', 'format_indent_decrease', 'format_indent_increase', 'format_italic', 'format_line_spacing', 'format_list_bulleted', 'format_list_numbered', 'format_paint', 'format_quote', 'format_shapes', 'format_size', 'format_strikethrough', 'format_textdirection_l_to_r', 'format_textdirection_r_to_l', 'format_underlined', 'forum', 'forward', 'forward_10', 'forward_30', 'forward_5', 'free_breakfast', 'fullscreen', 'fullscreen_exit', 'functions', 'g_translate', 'gamepad', 'games', 'gavel', 'gesture', 'get_app', 'gif', 'golf_course', 'gps_fixed', 'gps_not_fixed', 'gps_off', 'grade', 'gradient', 'grain', 'graphic_eq', 'grid_off', 'grid_on', 'group', 'group_add', 'group_work', 'hd', 'hdr_off', 'hdr_on', 'hdr_strong', 'hdr_weak', 'headset', 'headset_mic', 'healing', 'hearing', 'help', 'help_outline', 'high_quality', 'highlight', 'highlight_off', 'history', 'home', 'hot_tub', 'hotel', 'hourglass_empty', 'hourglass_full', 'http', 'https', 'image', 'image_aspect_ratio', 'import_contacts', 'import_export', 'important_devices', 'inbox', 'indeterminate_check_box', 'info', 'info_outline', 'input', 'insert_chart', 'insert_comment', 'insert_drive_file', 'insert_emoticon', 'insert_invitation', 'insert_link', 'insert_photo', 'invert_colors', 'invert_colors_off', 'iso', 'keyboard', 'keyboard_arrow_down', 'keyboard_arrow_left', 'keyboard_arrow_right', 'keyboard_arrow_up', 'keyboard_backspace', 'keyboard_capslock', 'keyboard_hide', 'keyboard_return', 'keyboard_tab', 'keyboard_voice', 'kitchen', 'label', 'label_outline', 'landscape', 'language', 'laptop', 'laptop_chromebook', 'laptop_mac', 'laptop_windows', 'last_page', 'launch', 'layers', 'layers_clear', 'leak_add', 'leak_remove', 'lens', 'library_add', 'library_books', 'library_music', 'lightbulb_outline', 'line_style', 'line_weight', 'linear_scale', 'link', 'linked_camera', 'list', 'live_help', 'live_tv', 'local_activity', 'local_airport', 'local_atm', 'local_bar', 'local_cafe', 'local_car_wash', 'local_convenience_store', 'local_dining', 'local_drink', 'local_florist', 'local_gas_station', 'local_grocery_store', 'local_hospital', 'local_hotel', 'local_laundry_service', 'local_library', 'local_mall', 'local_movies', 'local_offer', 'local_parking', 'local_pharmacy', 'local_phone', 'local_pizza', 'local_play', 'local_post_office', 'local_printshop', 'local_see', 'local_shipping', 'local_taxi', 'location_city', 'location_disabled', 'location_off', 'location_on', 'location_searching', 'lock', 'lock_open', 'lock_outline', 'looks', 'looks_3', 'looks_4', 'looks_5', 'looks_6', 'looks_one', 'looks_two', 'loop', 'loupe', 'low_priority', 'loyalty', 'mail', 'mail_outline', 'map', 'markunread', 'markunread_mailbox', 'memory', 'menu', 'merge_type', 'message', 'mic', 'mic_none', 'mic_off', 'mms', 'mode_comment', 'mode_edit', 'monetization_on', 'money_off', 'monochrome_photos', 'mood', 'mood_bad', 'more', 'more_horiz', 'more_vert', 'motorcycle', 'mouse', 'move_to_inbox', 'movie', 'movie_creation', 'movie_filter', 'multiline_chart', 'music_note', 'music_video', 'my_location', 'nature', 'nature_people', 'navigate_before', 'navigate_next', 'navigation', 'near_me', 'network_cell', 'network_check', 'network_locked', 'network_wifi', 'new_releases', 'next_week', 'nfc', 'no_encryption', 'no_sim', 'not_interested', 'note', 'note_add', 'notifications', 'notifications_active', 'notifications_none', 'notifications_off', 'notifications_paused', 'offline_pin', 'ondemand_video', 'opacity', 'open_in_browser', 'open_in_new', 'open_with', 'pages', 'pageview', 'palette', 'pan_tool', 'panorama', 'panorama_fish_eye', 'panorama_horizontal', 'panorama_vertical', 'panorama_wide_angle', 'party_mode', 'pause', 'pause_circle_filled', 'pause_circle_outline', 'payment', 'people', 'people_outline', 'perm_camera_mic', 'perm_contact_calendar', 'perm_data_setting', 'perm_device_information', 'perm_identity', 'perm_media', 'perm_phone_msg', 'perm_scan_wifi', 'person', 'person_add', 'person_outline', 'person_pin', 'person_pin_circle', 'personal_video', 'pets', 'phone', 'phone_android', 'phone_bluetooth_speaker', 'phone_forwarded', 'phone_in_talk', 'phone_iphone', 'phone_locked', 'phone_missed', 'phone_paused', 'phonelink', 'phonelink_erase', 'phonelink_lock', 'phonelink_off', 'phonelink_ring', 'phonelink_setup', 'photo', 'photo_album', 'photo_camera', 'photo_filter', 'photo_library', 'photo_size_select_actual', 'photo_size_select_large', 'photo_size_select_small', 'picture_as_pdf', 'picture_in_picture', 'picture_in_picture_alt', 'pie_chart', 'pie_chart_outlined', 'pin_drop', 'place', 'play_arrow', 'play_circle_filled', 'play_circle_outline', 'play_for_work', 'playlist_add', 'playlist_add_check', 'playlist_play', 'plus_one', 'poll', 'polymer', 'pool', 'portable_wifi_off', 'portrait', 'power', 'power_input', 'power_settings_new', 'pregnant_woman', 'present_to_all', 'print', 'priority_high', 'public', 'publish', 'query_builder', 'question_answer', 'queue', 'queue_music', 'queue_play_next', 'radio', 'radio_button_checked', 'radio_button_unchecked', 'rate_review', 'receipt', 'recent_actors', 'record_voice_over', 'redeem', 'redo', 'refresh', 'remove', 'remove_circle', 'remove_circle_outline', 'remove_from_queue', 'remove_red_eye', 'remove_shopping_cart', 'reorder', 'repeat', 'repeat_one', 'replay', 'replay_10', 'replay_30', 'replay_5', 'reply', 'reply_all', 'report', 'report_problem', 'restaurant', 'restaurant_menu', 'restore', 'restore_page', 'ring_volume', 'room', 'room_service', 'rotate_90_degrees_ccw', 'rotate_left', 'rotate_right', 'rounded_corner', 'router', 'rowing', 'rss_feed', 'rv_hookup', 'satellite', 'save', 'scanner', 'schedule', 'school', 'screen_lock_landscape', 'screen_lock_portrait', 'screen_lock_rotation', 'screen_rotation', 'screen_share', 'sd_card', 'sd_storage', 'search', 'security', 'select_all', 'send', 'sentiment_dissatisfied', 'sentiment_neutral', 'sentiment_satisfied', 'sentiment_very_dissatisfied', 'sentiment_very_satisfied', 'settings', 'settings_applications', 'settings_backup_restore', 'settings_bluetooth', 'settings_brightness', 'settings_cell', 'settings_ethernet', 'settings_input_antenna', 'settings_input_component', 'settings_input_composite', 'settings_input_hdmi', 'settings_input_svideo', 'settings_overscan', 'settings_phone', 'settings_power', 'settings_remote', 'settings_system_daydream', 'settings_voice', 'share', 'shop', 'shop_two', 'shopping_basket', 'shopping_cart', 'short_text', 'show_chart', 'shuffle', 'signal_cellular_4_bar', 'signal_cellular_connected_no_internet_4_bar', 'signal_cellular_no_sim', 'signal_cellular_null', 'signal_cellular_off', 'signal_wifi_4_bar', 'signal_wifi_4_bar_lock', 'signal_wifi_off', 'sim_card', 'sim_card_alert', 'skip_next', 'skip_previous', 'slideshow', 'slow_motion_video', 'smartphone', 'smoke_free', 'smoking_rooms', 'sms', 'sms_failed', 'snooze', 'sort', 'sort_by_alpha', 'spa', 'space_bar', 'speaker', 'speaker_group', 'speaker_notes', 'speaker_notes_off', 'speaker_phone', 'spellcheck', 'star', 'star_border', 'star_half', 'stars', 'stay_current_landscape', 'stay_current_portrait', 'stay_primary_landscape', 'stay_primary_portrait', 'stop', 'stop_screen_share', 'storage', 'store', 'store_mall_directory', 'straighten', 'streetview', 'strikethrough_s', 'style', 'subdirectory_arrow_left', 'subdirectory_arrow_right', 'subject', 'subscriptions', 'subtitles', 'subway', 'supervisor_account', 'surround_sound', 'swap_calls', 'swap_horiz', 'swap_vert', 'swap_vertical_circle', 'switch_camera', 'switch_video', 'sync', 'sync_disabled', 'sync_problem', 'system_update', 'system_update_alt', 'tab', 'tab_unselected', 'tablet', 'tablet_android', 'tablet_mac', 'tag_faces', 'tap_and_play', 'terrain', 'text_fields', 'text_format', 'textsms', 'texture', 'theaters', 'thumb_down', 'thumb_up', 'thumbs_up_down', 'time_to_leave', 'timelapse', 'timeline', 'timer', 'timer_10', 'timer_3', 'timer_off', 'title', 'toc', 'today', 'toll', 'tonality', 'touch_app', 'toys', 'track_changes', 'traffic', 'train', 'tram', 'transfer_within_a_station', 'transform', 'translate', 'trending_down', 'trending_flat', 'trending_up', 'tune', 'turned_in', 'turned_in_not', 'tv', 'unarchive', 'undo', 'unfold_less', 'unfold_more', 'update', 'usb', 'verified_user', 'vertical_align_bottom', 'vertical_align_center', 'vertical_align_top', 'vibration', 'video_call', 'video_label', 'video_library', 'videocam', 'videocam_off', 'videogame_asset', 'view_agenda', 'view_array', 'view_carousel', 'view_column', 'view_comfy', 'view_compact', 'view_day', 'view_headline', 'view_list', 'view_module', 'view_quilt', 'view_stream', 'view_week', 'vignette', 'visibility', 'visibility_off', 'voice_chat', 'voicemail', 'volume_down', 'volume_mute', 'volume_off', 'volume_up', 'vpn_key', 'vpn_lock', 'wallpaper', 'warning', 'watch', 'watch_later', 'wb_auto', 'wb_cloudy', 'wb_incandescent', 'wb_iridescent', 'wb_sunny', 'wc', 'web', 'web_asset', 'weekend', 'whatshot', 'widgets', 'wifi', 'wifi_lock', 'wifi_tethering', 'work', 'wrap_text', 'youtube_searched_for', 'zoom_in', 'zoom_out', 'zoom_out_map']
    }
  },
  computed: {
    widths () {
      let widths = []
      for (let index = 0; index < 12; index++) {
        const element = {
          width: index + 1,
          class: 'xs' + (index + 1) + ' pa-3'
        }
        widths.push(element)
      }
      return widths
    }
  },
  created () {
    this.editField = Object.assign({}, this.field)
    this.tableColumns.splice(0)
    if (this.field.tableColumns) {
      this.field.tableColumns.forEach(column => {
        this.tableColumns.push(Object.assign({}, column))
      })
    }
  },
  methods: {
    ok () {
      if (this.editField.tableColumns) {
        this.editField.tableColumns.splice(0)
      }
      this.tableColumns.forEach(column => {
        this.editField.tableColumns.push(Object.assign({}, column))
      })
      this.$emit('ok', {index: this.index, field: this.editField})
      this.dialog = false
    },
    cancel () {
      this.dialog = false
    },
    removeField () {
      this.$emit('removeField', this.index)
      this.dialog = false
    },
    addColumn () {
      this.tableColumns.push({id: Date.now()})
    },
    removeColumn (i) {
      this.tableColumns.splice(i, 1)
    }
  },
  watch: {
    dialog (value) {
      if (value) {
        this.editField = Object.assign({}, this.field)
        this.tableColumns.splice(0)
        if (this.field.tableColumns) {
          this.field.tableColumns.forEach(column => {
            this.tableColumns.push(Object.assign({}, column))
          })
        }
      }
    }
  },
  components: {
    draggable
  }
}
</script>

