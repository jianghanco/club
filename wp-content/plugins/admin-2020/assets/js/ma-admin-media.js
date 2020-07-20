
var imageEditor;



jQuery(document).ready(function($) {






    refreshFolderCount();

    $('#admin2020upload').on('change', function(e){
      	e.preventDefault;
        preupload(jQuery('#admin2020upload')[0]);
    })

    $('.admin2020filterControlmonth').on('click',function(e) {
        filtertext = jQuery(this).text();
        if (filtertext == 'All'){
          jQuery("#selectedfilters #month").html('');

          if (jQuery("#selectedfilters #month").html() == "" && jQuery("#selectedfilters #year").html() == "" && jQuery("#selectedfilters #user").html() == ""){
            jQuery("#selectedfilters #clearall").hide();
          }
        }else {
          jQuery("#selectedfilters #month").html('<span class="uk-label">'+filtertext+'</span>');
          jQuery("#selectedfilters #clearall").show();
        }
    });

    $('.admin2020filterControlyear').on('click',function(e) {
        filtertext = jQuery(this).text();
        if (filtertext == 'All'){
          jQuery("#selectedfilters #year").html('');

          if (jQuery("#selectedfilters #month").html() == "" && jQuery("#selectedfilters #year").html() == "" && jQuery("#selectedfilters #user").html() == ""){
            jQuery("#selectedfilters #clearall").hide();
          }
        }else {
          jQuery("#selectedfilters #year").html('<span class="uk-label">'+filtertext+'</span>');
          jQuery("#selectedfilters #clearall").show();
        }
    });

    $('.admin2020filterControluser').on('click',function(e) {
        filtertext = jQuery(this).text();
        if (filtertext == 'All'){
          jQuery("#selectedfilters #user").html('');

          if (jQuery("#selectedfilters #month").html() == "" && jQuery("#selectedfilters #year").html() == "" && jQuery("#selectedfilters #user").html() == ""){
            jQuery("#selectedfilters #clearall").hide();
          }
        }else {
          jQuery("#selectedfilters #user").html('<span class="uk-label">'+filtertext+'</span>');
          jQuery("#selectedfilters #clearall").show();
        }
    });

    $('.admin2020filterControlalll').on('click',function(e) {
          jQuery("#selectedfilters #year").html('');
          jQuery("#selectedfilters #month").html('');
          jQuery("#selectedfilters #user").html('');
          jQuery("#selectedfilters #clearall").hide();
    });


    $('#admin2020listView').on('click',function(e) {
        $('.admin2020_media_gallery').addClass('admin2020_list_view');
        $('.admin2020_media_gallery').addClass('uk-grid-small');
    });
    $('#admin2020gridView').on('click',function(e) {
        $('.admin2020_media_gallery').removeClass('admin2020_list_view');
        $('.admin2020_media_gallery').removeClass('uk-grid-small');
    });

    $('#admin2020_image_edit').on('click',function(e) {

      var imagelink = $("#admin2020_viewer_fullLink").val();
      var imageTitle = $("#admin2020_viewer_title").val();


      imageEditor = new tui.ImageEditor('#admin2020_image_edit_area', {
             includeUI: {
               loadImage: {
                    path: imagelink,
                    name: 'Blank'
                },
                 theme: blackTheme, // or whiteTheme
                 initMenu: 'filter',
                 menuBarPosition: 'right'
             },
             cssMaxWidth: 700,
             cssMaxHeight: 500,
             usageStatistics: false
         });

         //imageEditor.loadImageFromURL(imagelink, imageTitle);
         window.onresize = function() {
             imageEditor.ui.resizeEditor();
         }

      $('.tui-image-editor-header-buttons .tui-image-editor-download-btn').
      replaceWith('<span class="uk-padding-small" style="float:left"><a onclick="admin2020_save_edited_as_copy(this);" href="#" class="uk-button uk-button-primary uk-margin-right" >Save as copy</a><a href="#" onclick="admin2020_save_edited(this);" class="uk-button uk-button-primary" >Save</a></span>');
      $('.tui-image-editor-header-logo').hide();
      // $('.tui-image-editor-menu').hide();

      // $('.tui-image-editor-header-buttons div:first').hide();
      var loadBtn = $('.tui-image-editor-header-buttons div:first');
			loadBtn.hide();


        $('.admin2020_image_edit_wrap').show();
    });

    $('#admin2020mediaSearch').on('keyup', function(e){
      searchterm = jQuery(this).val().toLowerCase();

      $('.admin2020_media_gallery > div').each(function() {
          content = "";
          if (jQuery(this).hasClass('admin2020_attachment')){
            content = jQuery(this).text().toLowerCase();
          }
          if (content.indexOf(searchterm) !== -1){
            jQuery(this).fadeIn(100);
          } else {
            jQuery(this).fadeOut(100);
          }
      })

    })

})


function admin2020_save_edited(item){

  jQuery(item).html('Saving <div class="image_save_spinner" uk-spinner></div>');

  imageurl = jQuery("#admin2020_viewer_fullLink").val();
  parts = imageurl.split("/");
  filename = parts[parts.length - 1];
  imageid = jQuery("#admin2020_viewer_currentid").text();

  img = imageEditor.toDataURL();
  blob = dataURLtoBlob(img);


  fd = new FormData();
  fd.append("ammended_image", blob, filename);
  fd.append("attachmentid", imageid);
  fd.append('security', ma_admin_ajax.security);
  fd.append('action', 'admin2020_upload_edited_image');

  jQuery.ajax({
      url: ma_admin_ajax.ajax_url,
      type: 'post',
      data: fd,
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {




        jQuery(item).html('Image Saved');
        jQuery('.admin2020_image_edit_wrap').hide();
        admin2020_notification('Image Saved!', 'success');
        jQuery('.admin2020_media_gallery').html(response);

        press = [];
        press.target = '';
        press.shiftKey = false;
        target = '#attachment'+imageid;

        admin2020_attachment_info(jQuery(target), press);

      },
      error: function (error) {
        console.log(error);
      }
  });

}


function admin2020_save_edited_as_copy(item){

  jQuery(item).html('Saving <div class="image_save_spinner" uk-spinner></div>');

  imageurl = jQuery("#admin2020_viewer_fullLink").val();
  parts = imageurl.split("/");
  filename = parts[parts.length - 1];
  imageid = jQuery("#admin2020_viewer_currentid").text();

  img = imageEditor.toDataURL();
  blob = dataURLtoBlob(img);


  fd = new FormData();
  fd.append("ammended_image", blob, filename);
  fd.append("attachmentid", imageid);
  fd.append("file_name", filename);
  fd.append('security', ma_admin_ajax.security);
  fd.append('action', 'admin2020_upload_edited_image_as_copy');

  jQuery.ajax({
      url: ma_admin_ajax.ajax_url,
      type: 'post',
      data: fd,
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {

        jQuery(item).html('Image Saved');
        jQuery('.admin2020_image_edit_wrap').hide();
        admin2020_notification('Image Saved!', 'success');
        jQuery('.admin2020_media_gallery').html(response);

        press = [];
        press.target = '';
        press.shiftKey = false;
        target = '#attachment'+imageid;

        admin2020_attachment_info(jQuery(".admin2020_attachment").first(), press);

      },
      error: function (error) {
        console.log(error);
      }
  });

}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function copythis(item){

  var copyText = document.getElementById("admin2020_viewer_fullLink");



  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  jQuery('#linkcopied').show().delay(1000).fadeOut("slow");


}

function get_active_folder_id(){

  activerfolder = jQuery('#admin2020folderswrap .admin2020folder .uk-active');
  if (jQuery(activerfolder).length > 0){
    activefolderid = jQuery(activerfolder).parent().attr('folder-id');
  } else {
    activefolderid = 0;
  }

  return activefolderid;

}


function admin2020newfolder(){

  foldername = jQuery("#foldername").val();
  activeid = get_active_folder_id();
  ///CHECK FOR INPUT
  if (foldername.length > 0){


    jQuery.ajax({
        url: ma_admin_media_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_create_folder',
            security: ma_admin_media_ajax.security,
            title: foldername,
            activeid: activeid,
        },
        success: function(response) {
            jQuery('#admin2020folderswrap').html(response);
            admin2020_notification('Folder Created!', 'success');
            refreshFolderCount();
        }
    });


  }

}


function admin2020createSubfolder(parentid){

    activeid = get_active_folder_id();

    jQuery.ajax({
        url: ma_admin_media_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_create_sub_folder',
            security: ma_admin_media_ajax.security,
            parentid: parentid,
            activeid: activeid,
        },
        success: function(response) {
            jQuery('#admin2020folderswrap').html(response);
            admin2020_notification('Folder Created!', 'success');
            refreshFolderCount();
        }
    });




}


function admin2020deletefolder(folderid){

    activeid = get_active_folder_id();

    jQuery.ajax({
        url: ma_admin_media_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_delete_folder',
            security: ma_admin_media_ajax.security,
            folderid: folderid,
            activeid: activeid,
        },
        success: function(response) {
            jQuery('#admin2020folderswrap').html(response);
            admin2020_notification('Folder deleted!', 'warning');
            refreshFolderCount();
        }
    });


}

function admin2020renamefolder(folderid){

  activeid = get_active_folder_id();

  newfoldername = jQuery("#"+folderid+"changefoldername").val();
  ///CHECK FOR INPUT
  if (newfoldername.length > 0){


    jQuery.ajax({
        url: ma_admin_media_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_rename_folder',
            security: ma_admin_media_ajax.security,
            title: newfoldername,
            folderid: folderid,
            activeid: activeid,
        },
        success: function(response) {
            jQuery('#admin2020folderswrap').html(response);
            admin2020_notification('Folder renamed!', 'success');
            refreshFolderCount();
        }
    });


  }

}





//////DRAG AND DROP

/// DRAG OVER
function admin2020mediaAllowDrop(ev) {
  ev.preventDefault();
  drop = ev.target;
  if (jQuery(drop).hasClass('admin2020folder')){
    jQuery(drop).addClass('folderdrag');
  } else {
    jQuery(drop).closest('.admin2020folder').addClass('folderdrag');
  }
  //ev.target.classList.add("folderdrag");
}

/// DRAG LEAVE
function admin2020mediaDropOut(ev) {
  ev.preventDefault();
  drop = ev.target;
  if (jQuery(drop).hasClass('admin2020folder')){
    jQuery(drop).removeClass('folderdrag');
  } else {
    jQuery(drop).closest('.admin2020folder').removeClass('folderdrag');
  }
}

///DRAG START
function admin2020mediadrag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);

  thefiles = jQuery('.admin2020_media_select:checkbox:checked').length
  if (thefiles < 1){
    thefiles = 1+" file";
  } else {
    thefiles = thefiles+" files";
  }

  var elem = document.createElement("div");
  elem.id = "admin2020dragHandle";
  elem.innerHTML = thefiles;
  elem.style.position = "absolute";
  elem.style.top = "-1000px";
  document.body.appendChild(elem);
  ev.dataTransfer.setDragImage(elem, 0, 0);
}

///DROP
function admin2020mediadrop(ev) {
  ev.preventDefault();
  drop = ev.target;

  if (jQuery(drop).hasClass('admin2020folder')){
    jQuery(drop).removeClass('folderdrag');
    folder = ev.target;
  } else {
    jQuery(drop).closest('.admin2020folder').removeClass('folderdrag');
    folder = jQuery(drop).closest('.admin2020folder');
  }

  if (jQuery(folder).hasClass('admin2020allFolders')){
    folderid = "";
  } else {
    folderid = jQuery(folder).attr('folder-id');
  }

  theids = [];
  amount = jQuery('.admin2020_media_select:checkbox:checked').length

  if (amount > 0){
    jQuery('.admin2020_media_select:checkbox:checked').each( function( index, element ){

      theid = jQuery(element).attr('admin2020_attachmentid');
      theids.push(theid);

    });
  } else {
    data = ev.dataTransfer.getData("text");
    lonedragger = document.getElementById(data);
    theid = jQuery(lonedragger).attr('admin2020_attachmentid');
    theids.push(theid);
  }


  movetofolder(folderid,theids);

  //var data = ev.dataTransfer.getData("text");
  //ev.target.appendChild(document.getElementById(data));
}

function movetofolder(folderid,theids){

  jQuery.ajax({
      url: ma_admin_ajax.ajax_url,
      type: 'post',
      data: {
          action: 'admin2020_move_to_folder',
          security: ma_admin_ajax.security,
          theids: theids,
          folderid: folderid,
      },
      success: function(response) {
          //console.log(response);
          admin2020_notification('Files added to folder', 'primary');
          jQuery('.admin2020_media_gallery').removeClass('multiple');
          jQuery('.admin2020_delete_multiple').addClass('hidden');
          jQuery('.admin2020_media_gallery').html(response);
          refreshFolderCount();
      }
  });

}

function refreshFolderCount(){

  total = jQuery(".admin2020_media_gallery .admin2020_attachment").length;
  jQuery('.admin2020totalCount').text(total);

  jQuery('#admin2020folderswrap .admin2020folder').each( function( index, element ){

    folderid = jQuery(element).attr('folder-id');
    infolder =jQuery(".admin2020_media_gallery [admin2020_folders='"+folderid+"'").length;
    jQuery(element).find('.admin2020folderCount').text(infolder);


  });
}








function preupload(files_data){


  jQuery(".admin2020uploadItems").html('');


    count = 0;

    jQuery.each(files_data.files,function(j,file){


      name = file.name;
      filesize = file.size;
      filetype = file.type;
      src = URL.createObjectURL(file);

      if (filetype.includes("image")){
        quickdisplay = '<img width="40" src="'+src+'">';
      }
      else if (filetype.includes("video")){
        quickdisplay = '<div class="uk-flex uk-flex-center" style="min-width:40px;"><span uk-icon="icon:video-camera"></span></div>';
      }
      else if (filetype.includes("application")){
        quickdisplay = '<div class="uk-flex uk-flex-center" style="min-width:40px;"><span uk-icon="icon:file-pdf"></span></div>';
      }
      else if (filetype.includes("audio")){
        quickdisplay = '<div class="uk-flex uk-flex-center" style="min-width:40px;"><span uk-icon="icon:microphone"></span></div>';
      }


      content = '<div class="admin2020uploaditem uk-grid-small uk-flex-middle uk-animation-slide-right" style="animation-delay:'+count+'s"uk-grid><div class="uk-width-auto">'+quickdisplay+'</div><div class="uk-width-expand"><div class="uk-margin-remove-bottom">'+name+'</div><p class="uk-text-meta uk-margin-remove-top">'+formatfilesize(filesize)+'</p></div><div class="uk-width-auto" uk-spinner></div></div>';

      jQuery(".admin2020uploadItems").append(content);

      count = count + 0.05;
    })


  thefiles = files_data.files;
  currentstat = '0/'+thefiles.length;
  jQuery('.admin2020upstat').text(currentstat);
  jQuery('.admin2020_loader_wrapper').show();

  checkfile(thefiles,0);


}

function formatfilesize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function uploadcallback(thefiles, index){

  currentstat = index+'/'+thefiles.length;
  jQuery('.admin2020upstat').text(currentstat);

  uploaditem = jQuery('.admin2020uploadItems .admin2020uploaditem')[index-1];
  jQuery(uploaditem).empty().append('<div class="uk-text-success">Item Uploaded!</div>');

  //jQuery(uploaditem).fadeOut(600, function(uploaditem){jQuery(uploaditem).remove()});

  if (index >= thefiles.length){

    admin2020uploadfinished();
    return;

  } else {

    checkfile(thefiles,index);

  }

}

function checkfile(thefiles,index){

  allowedTypes = ['image/jpeg', 'image/pjpeg','image/png','image/gif','image/x-icon',
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/mspowerpoint","application/powerpoint","application/vnd.ms-powerpoint","application/x-mspowerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/mspowerpoint","application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/vnd.oasis.opendocument.text",
  "application/excel","application/vnd.ms-excel","application/x-excel","application/x-msexcel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
  "audio/mpeg3","audio/x-mpeg-3","video/mpeg","video/x-mpeg",
  "audio/m4a",
  "audio/ogg",
  "audio/wav","audio/x-wav",
  "video/mp4",
  "video/x-m4v",
  "video/quicktime",
  "video/x-ms-asf","video/x-ms-wmv",
  "application/x-troff-msvideo","video/avi","video/msvideo","video/x-msvideo",
  "audio/mpeg"," video/mpeg",
  "video/ogg",
  "video/3gpp","audio/3gpp",
  "video/3gpp2","audio/3gpp2",
  "application/zip",
  "application/octet-stream",
  "application/x-zip-compressed",
  "multipart/x-zip"];



  filetype = thefiles[index].type;
  filesize = thefiles[index].size;
  maxfilesize = jQuery('#max-upload-size').text();


  if (filesize < maxfilesize){
    if (allowedTypes.includes(filetype)){
      processupload(thefiles,index);
    } else {
      uploaditem = jQuery('.admin2020uploadItems .admin2020uploaditem')[index];
      jQuery(uploaditem).empty().append('<div class="uk-text-danger">'+thefiles[index].name+' not uploaded. Unsupported File Type</div>');
      processupload(thefiles,index+1);
    }
  } else {
    uploaditem = jQuery('.admin2020uploadItems .admin2020uploaditem')[index];
    jQuery(uploaditem).empty().append('<div class="uk-text-danger">'+thefiles[index].name+' not uploaded. File size exceeds limit</div>');
    processupload(thefiles,index+1);
  }



}

function admin2020uploadfinished(){

  jQuery.ajax({
      url: ma_admin_ajax.ajax_url,
      type: 'post',
      data: {
          action: 'admin2020_get_media',
          security: ma_admin_ajax.security,
      },
      success: function(response) {
          jQuery('.admin2020_media_gallery').html(response);
          jQuery('.admin2020_loader_wrapper').hide();
          admin2020_notification('Upload Finsihed', 'primary');
      }
  });


}


function processupload(thefiles,index) {


    if (index >= thefiles.length){

      admin2020uploadfinished();
      return;

    }

    activerfolder = jQuery('#admin2020folderswrap .admin2020folder .uk-active');
    if (jQuery(activerfolder).length > 0){
      activefolderid = jQuery(activerfolder).parent().attr('folder-id');
    } else {
      activefolderid = "";
    }



    fd = new FormData();
    name = thefiles[index].name;
    fd.append(name, thefiles[index]);
    fd.append('security', ma_admin_ajax.security);
    fd.append('action', 'admin2020_upload_attachment');
    fd.append('folderid', activefolderid);

    jQuery.ajax({
        url: ma_admin_ajax.ajax_url,
        type: 'post',
        data: fd,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {


          uploadcallback(thefiles,(index + 1));

        },
        error: function (error) {
          console.log(error);
        }
    });


}


function admin2020searchAtachments(item){

    searchterm = jQuery(item).val().toLowerCase();

    jQuery('.attachments > .attachment').each(function() {

        content = jQuery(this).html().toLowerCase();

        if (content.indexOf(searchterm) !== -1){
          jQuery(this).fadeIn(100);
        } else {
          jQuery(this).fadeOut(100);
        }
    })

}

function get_media_later(media_index){

  jQuery.ajax({
      url: ma_admin_ajax.ajax_url,
      type: 'post',
      data: {
          action: 'admin2020_get_media_later',
          security: ma_admin_ajax.security,
          media_index: media_index,
      },
      success: function(response) {
          jQuery('.admin2020_media_gallery').append(response);
      }
  });

}


function admin2020_save_attachment() {

    title = jQuery("#admin2020_viewer_input_title").val();
    imgalt = jQuery("#admin2020_viewer_altText").val();
    caption = jQuery("#admin2020_viewer_caption").val();
    description = jQuery("#admin2020_viewer_description").val();
    imgid = jQuery("#admin2020_viewer_currentid").text();


    jQuery.ajax({
        url: ma_admin_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_save_attachment',
            security: ma_admin_ajax.security,
            title: title,
            imgalt: imgalt,
            caption: caption,
            description: description,
            imgid: imgid,
        },
        success: function(response) {
            //console.log(response);
            admin2020_notification('File Updated', 'success');
            jQuery('.admin2020_media_gallery').html(response);
        }
    });

}

function admin2020_delete_attachment() {


  imgid = jQuery("#admin2020_viewer_currentid").text();

    jQuery.ajax({
        url: ma_admin_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_delete_attachment',
            security: ma_admin_ajax.security,
            imgid: imgid,
        },
        success: function(response) {
            //console.log(response);
            admin2020_notification('File Deleted', 'primary');
            UIkit.toggle("#admin2020MediaViewer").toggle();
            jQuery('.admin2020_media_gallery').html(response);
        }
    });



}

function admin2020_delete_multiple_attachment() {

  if (jQuery('.admin2020_media_select:checkbox:checked').length < 1){
    admin2020_notification('No Items Selected', 'warning');
  }  else {

    theids = [];
    jQuery('.admin2020_media_select:checkbox:checked').each( function( index, element ){

      theid = jQuery(element).attr('admin2020_attachmentid');
      theids.push(theid);

    });

    jQuery.ajax({
        url: ma_admin_ajax.ajax_url,
        type: 'post',
        data: {
            action: 'admin2020_delete_multiple_attachment',
            security: ma_admin_ajax.security,
            theids: theids,
        },
        success: function(response) {
            //console.log(response);
            admin2020_notification('Files Deleted', 'primary');
            jQuery('.admin2020_media_gallery').removeClass('multiple');
            jQuery('.admin2020_delete_multiple').addClass('hidden');
            jQuery('.admin2020_media_gallery').html(response);
        }
    });

  }

}

function switchinfo(direction){

  currentid = jQuery("#admin2020_viewer_currentid").text();
  target = '#attachment'+currentid;
  press = [];
  press.target = '';
  press.shiftKey = false;

  if (direction == "right"){
    nextitem = jQuery(target).next();
    if (!jQuery(nextitem).hasClass('admin2020_attachment')){
      nextitem = jQuery(nextitem).next();
    }
    if (jQuery(nextitem).index() < jQuery('.admin2020_media_gallery > div').length - 1){
      admin2020_attachment_info(nextitem, press);
    }

  } else if (direction == "left"){
    nextitem = jQuery(target).prev();
    if (!jQuery(nextitem).hasClass('admin2020_attachment')){
      nextitem = jQuery(nextitem).prev();
    }
    if (jQuery(nextitem).index() >= 1){
      admin2020_attachment_info(nextitem, press);
    }
  }

}


function admin2020_attachment_info(item, press){

    clickarea = press.target;

    if (jQuery(clickarea).hasClass('admin2020_media_select')){
      return;
    }


    if (jQuery('.admin2020_media_select:checkbox:checked').length > 0){

      if(press.shiftKey){

        currentindex = jQuery(item).index();

        jQuery.each(jQuery('.admin2020_media_gallery .admin2020_attachment'), function(i, obj) {

          if (jQuery(obj).find('.admin2020_media_select').prop("checked") == true){

            lastindex = jQuery(obj).index();

          }

        })

        if (lastindex < currentindex){
          start = lastindex;
          end = currentindex;
        } else {
          start = currentindex;
          end = lastindex;
        }

        for (var n = start; n <= end; ++ n){

          attachment = jQuery('.admin2020_media_gallery > div')[n];
          if (jQuery(attachment).is(':visible')){

            checkbox = jQuery(attachment).find('.admin2020_media_select');
            jQuery(checkbox).prop('checked', true);

          }
          //.find('.admin2020_media_select');
          //checkbox.prop('checked', true);

        }

      } else {

      checkbox = jQuery(item).find('.admin2020_media_select');
      checkbox.prop('checked', !checkbox.prop("checked"));

      }

      if (jQuery('.admin2020_media_select:checkbox:checked').length < 1){
        jQuery('.admin2020_media_gallery').removeClass('multiple');
        jQuery('.admin2020_delete_multiple').addClass('hidden');
      }




    } else {

      type = jQuery(item).attr("admin2020_type");
      imgUrl = jQuery(item).attr("admin2020_image_src");

      jQuery("#admin2020_image_edit").hide();

      if (type.includes('image')){
        jQuery("#admin2020_image_edit").show();
        jQuery("#admin2020imgViewer").attr('src',imgUrl);
        jQuery("#admin2020videoViewer").hide();
        jQuery("#admin2020imgViewer").show();
        jQuery("#admin2020audioViewer").hide();
        jQuery("#admin2020docViewer").hide();
      } else if (type.includes('video')){
        jQuery("#admin2020videoViewer").attr('src',imgUrl);
        jQuery("#admin2020imgViewer").hide();
        jQuery("#admin2020videoViewer").show();
        jQuery("#admin2020audioViewer").hide();
        jQuery("#admin2020docViewer").hide();
      } else if (type.includes('application')){
        jQuery("#admin2020docViewer").show();
        jQuery("#admin2020imgViewer").hide();
        jQuery("#admin2020videoViewer").hide();
        jQuery("#admin2020audioViewer").hide();
      } else if (type.includes('audio')){
        jQuery("#admin2020audioplayer").attr('src',imgUrl);
        jQuery("#admin2020docViewer").hide();
        jQuery("#admin2020imgViewer").hide();
        jQuery("#admin2020videoViewer").hide();
        jQuery("#admin2020audioViewer").show();
      }


      filename = jQuery(item).attr("admin2020_filename");
      uploadedon = jQuery(item).attr("admin2020_uploaded_on");
      filesize = jQuery(item).attr("admin2020_file_size");
      dimensions = jQuery(item).attr("admin2020_file_dimensions");
      attachmentid = jQuery(item).attr("admin2020_attachmentid");

      jQuery("#admin2020_viewer_currentid").text(attachmentid);

      alt = jQuery(item).attr("admin2020_file_alt");
      caption = jQuery(item).attr("admin2020_file_caption");
      description = jQuery(item).attr("admin2020_file_description");

      jQuery("#admin2020_viewer_title").text(filename);

      jQuery("#admin2020_uploaded_on").text(uploadedon);
      jQuery("#admin2020_file_size").text(filesize);
      jQuery("#admin2020_file_dimensions").text(dimensions);
      jQuery("#admin2020_type").text(type);

      jQuery("#admin2020_viewer_fullLink").val(imgUrl);
      jQuery("#admin2020_viewer_input_title").val(filename);
      jQuery("#admin2020_viewer_altText").val(alt);
      jQuery("#admin2020_viewer_caption").val(caption);
      jQuery("#admin2020_viewer_description").val(description);

      UIkit.offcanvas('#admin2020MediaViewer').show();

  }

}


function admin2020_multiple_select(){

  if (jQuery('.admin2020_media_select:checkbox:checked').length > 0){
    jQuery('.admin2020_media_gallery').addClass('multiple');
    jQuery('.admin2020_delete_multiple').removeClass('hidden');
  } else {
    jQuery('.admin2020_media_gallery').removeClass('multiple');
    jQuery('.admin2020_delete_multiple').addClass('hidden');
  }
}
