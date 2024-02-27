// JavaScript Document

var initLoader;
var curLink = '';
var clicksDone = 0;
var query = window.location.search.substring(1);
var qs = parse_query_string(query);
var resourceObjects = new Object();

jQuery(function () {

     var clicksDone = 0;
     var current_assignment = (qs['assignment_id']) ? qs['assignment_id'] : jQuery('#lrnapp').attr("class");

     jQuery("#lrnapp").prepend('<div class="container-fluid"><div class="row"><div id="ibMain" class="col-sm-12" style="min-height:170px;"><div id="loader" onload="init()"></div><div style="display:none;" id="contentDiv" class="animate-bottom"></div></div></div></div>');

     jQuery("body").prepend('<div class="modal fade"  style="z-index: 10000000 !important;" id="resourceModal" tabindex="-1" role="dialog" aria-labelledby="resourceModalLabel"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="resourceModalLabel">Title</h4> </div> <div id="resourceModalContent" class="modal-body"> <p>resource</p> </div> <div class="modal-footer"><button id="nwBtn" type="button" class="btn btn-default" style="float: left" data-link="">New Window</button><button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div>');

     jQuery("#nwBtn").click(function () {
          var form = document.createElement("form");
          form.method = "GET";
          form.action = curLink;
          form.target = "_blank";
          document.body.appendChild(form);
          form.submit();
          jQuery("#resourceModal").modal("hide");
     });

     jQuery.ajax({
          method: 'GET',
          url: 'https://inside-out-project.com/wp-json/wp/v2/insight_assignments/' + current_assignment,
          dataType: 'json',
          success: function () {
               var objret = arguments[0];
               jQuery("#contentDiv").html(objret.content.rendered).slideDown(2000, function () {
                    
                    insightTitle = objret.title.rendered;
                    
                    jQuery("#headerRow").prepend('<h1 style=" display: inline; float:left; font-size: 1.5em; position:relative; top:-15px;">'+insightTitle+'</h1>');
                    
                    if (objret.assignment_resources.length > 0) {
                         
                         jQuery("#resourcesHolder").append('<div id="assignmentsWrapper"><div id="assignmentsTtl" class="widget-title"><strong>Assignment Resources</strong></div><div id="lessonAssignmentsDiv" class="asideDiv"><div class="list-group lessonResources"></div></div></div>');

                         objret.assignment_resources.forEach(function (vid) {
                              addResource(vid, "l");
                         });
                    }

                    
                    showPage();

                    jQuery("#appOpennerTab").on("click", function () {
                         window.open('https://inside-out-project.com/learningJApp/iapp_1_0_0_0_assignment.html?assignment_id=' + current_assignment, 'new', '');
                    });
                    
                    jQuery("#contentDiv a").click(function () {
                         window.open('' + this.href + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
                         return false;
                    });
                    
                    
               });
          },
          error: function () {
               console.log('AWWW!');
          },
          progress: function (e) {
               console.log(e);
          }
     });

});

function init() {
     initLoader = setTimeout(showPage, 300);
}

function showPage() {
     document.getElementById("contentDiv").style.display = "block";
     // document.getElementById("lessonAssignmentsDiv").style.display = "block";
     //document.getElementById("lessonResourcesDiv").style.display = "block";
     //document.getElementById("additionalResourcesDiv").style.display = "block";
     document.getElementById("loader").style.display = "none";
}

function printPage(id) {
     var html = "<html>";
     html += document.getElementById(id).innerHTML;

     html += "</html>";

     var printWin = window.open('', '', 'left=50,top=50,width="50%",height="90%",toolbar=0,scrollbars=0,status=0');
     printWin.document.write(html);
     printWin.document.close();
     printWin.focus();
     printWin.print();
     printWin.close();
}

function parse_query_string(query) {
     var vars = query.split("&");
     var query_string = {};
     for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          // If first entry with this name
          if (typeof query_string[pair[0]] === "undefined") {
               query_string[pair[0]] = decodeURIComponent(pair[1]);
               // If second entry with this name
          } else if (typeof query_string[pair[0]] === "string") {
               var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
               query_string[pair[0]] = arr;
               // If third or later entry with this name
          } else {
               query_string[pair[0]].push(decodeURIComponent(pair[1]));
          }
     }
     return query_string;
}

function resourceClick(elem) {
     var current_link = resourceObjects[elem.id].resource_link;
     //console.log(current_link);
     if (resourceObjects[elem.id].post_type == 'lessonAssignment') {
          jQuery("#resourceModalLabel").html(resourceObjects[elem.id].post_title);
          jQuery("#resourceModalContent").html(resourceObjects[elem.id].post_content);
     } else if (current_link.indexOf("http://") !== -1) {
          jQuery("#resourceModalLabel").html(resourceObjects[elem.id].post_title);
          jQuery("#resourceModalContent").html('' + current_link + ' is being opened in another window due to security restrictions.');
          window.open('' + current_link + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
     } else {
          jQuery("#resourceModalLabel").html(resourceObjects[elem.id].post_title);
          jQuery("#resourceModalContent").html('Loading content...');

          //current_link = current_link.replace("http://", "https://");

          if (current_link.indexOf("youtube") !== -1) {

               jQuery("#resourceModalContent").html('<iframe width="860" height="440" src="' + current_link + '" frameborder="0" allowfullscreen></iframe>');
               jQuery("#nwBtn").on("click", function () {
                    window.open('' + current_link + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
               });
               jQuery("#nwBtn").hide();
          } else if (current_link.indexOf("fiddle") !== -1) {
               jQuery("#resourceModalContent").html(resourceObjects[elem.id].post_content);
               jQuery("#nwBtn").on("click", function () {
                    window.open('' + current_link + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
               });
               jQuery("#nwBtn").hide();

          } else {

               $.get("https://inside-out-project.com/learningJApp/link_check.php?url=" + encodeURIComponent(current_link), function (data) {
                    if (data == "ya") {
                         //console.log('current_link checked and good: ' + current_link);
                         jQuery("#resourceModalContent").html('<iframe width="860" height="440" src="' + current_link + '" frameborder="0" allowfullscreen></iframe>');
                         jQuery("#nwBtn").on("click", function () {
                              window.open('' + current_link + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
                         });
                         jQuery("#nwBtn").hide();
                    } else {
                         jQuery("#resourceModalContent").html('' + current_link + ' is being opened in another window due to security restrictions.');
                         window.open('' + current_link + '', '_blank', 'toolbar=no,scrollbars=no,resizable=yes,top=50,left=50,width=850,height=575');
                    }
               });
          }

     }

}

function addResource(vid, resType) {
     var curId = vid['id'];
     // console.log('            curId: ' + curId);
     if (!resourceObjects[curId]) {
          var irLink = vid['resource_link'];
          var format = 'fa-external-link';
          var linkType = 'link';
          if (irLink.indexOf("youtube") !== -1) {
               if (irLink.indexOf("embed") !== -1) {
                    irLink = irLink + '?rel=0&amp;showinfo=0?ecver=1';
               } else {
                    irLink = 'https://www.youtube.com/embed/' + irLink.replace("https://www.youtube.com/watch?v=", "") + '?rel=0&amp;showinfo=0?ecver=1';
               }
               format = 'fa-youtube-play';
          } else if (irLink.indexOf("jsfiddle") !== -1) {
               format = 'fa-jsfiddle';
               linkType = 'jsfiddle';
          } else if (irLink.indexOf("wikipedia") !== -1) {
               format = 'fa-wikipedia-w';
          } else if (irLink.indexOf("vimio") !== -1) {
               format = 'fa-vimeo-square';
               linkType = 'video';
          } else if (irLink.indexOf(".mp4") !== -1) {
               format = 'fa-youtube-play';
               linkType = 'video';
          }
          resourceObjects[curId] = [];
          resourceObjects[curId].id = vid['id'];
          resourceObjects[curId].post_title = vid['post_title'];
          resourceObjects[curId].resource_link = irLink;
          resourceObjects[curId].post_content = vid['post_content'];
          resourceObjects[curId].post_type = vid['post_type'];
          resourceObjects[curId].post_format = format;

          var resDiv = (resType === 'a') ? ".additionalResources" : ".lessonResources";
          resDiv = (linkType === 'jsfiddle') ? ".examplesResources" : resDiv;
          resDiv = (resourceObjects[curId].post_title.indexOf("helper") !== -1) ? ".helpModalContent" : resDiv;

          if (vid.insight_category.length > 0) {
               vid.insight_category.forEach(function (vid2) {
                    //resDiv = (vid2.slug === 'example') ? ".examplesResources" : resDiv;
                    
                    if(vid2.slug === 'example'){
                         resDiv = ".examplesResources";
                    jQuery("#exampleResourcesHeaderMenu").append('<li><a id="' + resourceObjects[curId].id + '" data-toggle="modal" data-target="#resourceModal" title="' + resourceObjects[curId].post_title + '" data-ref="' + resourceObjects[curId].resource_link + '" onclick="resourceClick(this)"><i class="fa ' + resourceObjects[curId].post_format + ' fa-fw" aria-hidden="true"></i>&nbsp; ' + resourceObjects[curId].post_title + '</a></li>');
                    }

               });
          }

          jQuery(resDiv).append('<a id="' + resourceObjects[curId].id + '" class="sideresource list-group-item" data-toggle="modal" data-target="#resourceModal" title="' + resourceObjects[curId].post_title + '" data-ref="' + resourceObjects[curId].resource_link + '" onclick="resourceClick(this)"><i class="fa ' + resourceObjects[curId].post_format + ' fa-fw" aria-hidden="true"></i>&nbsp; ' + resourceObjects[curId].post_title + '</a>');

          resourceObjects[curId].lessonResources = (resType === 'l') ? 1 : 0;
          resourceObjects[curId].additionalResources = (resType === 'a') ? 1 : 0;

          return '<a id="' + resourceObjects[curId].id + '" data-toggle="modal" data-target="#resourceModal" title="' + resourceObjects[curId].post_title + '" data-ref="' + resourceObjects[curId].resource_link + '" onclick="resourceClick(this)">&nbsp; ' + resourceObjects[curId].post_title + '</a>';

     }
}

