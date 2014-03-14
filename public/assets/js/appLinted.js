/* ************* Rating Widget ************************** */
/** Will take a div that has child star elements and hooks up
rating functionality to it **/

/**
*@param ratingList - a span that has star spans
*@param toggle - if the widget already exists, it's current rating
*/
var ratingWidget = function(ratingList, toggle)
{
	var that = this;
	this.starCount = toggle||0;
	this.ratingList = ratingList;
	this.listId = this.ratingList.attr('id');

	$.each(this.ratingList.find('.tara'), function(i, star){
	
		$(star).attr('id', that.listId+"_"+i).css('cursor', 'pointer')
				.on('mouseover', function(){ return that.rateOver( i ); })
				.click(function(){ return that.rateClick( i ); });
	});
	this.ratingList.on('mouseout', $.proxy(this.rateOut, this));
};

ratingWidget.prototype.rateOver=function(i)
{
	for(var j=0; j<5; j++)
	{
		if(j<=i)
		{
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
		}
		else
		{
			$('#'+this.listId+"_"+j).addClass('fa-star-o');
		}
	}
};

ratingWidget.prototype.rateClick=function(i)
{
	for(var j = 0; j < 5; j++)
	{
		if(j <=i)
		{
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
			$("#"+this.listId+"_"+j).off();
		}
		
		$("#"+this.listId+"_"+j).off();
	
	}
	this.ratingList.off('mouseout');
	this.ratingList.attr('data-rating', i+1);
};


ratingWidget.prototype.rateOut=function()
{
	for(var j = 0; j < 5; j++)
	{
		if(j<this.starCount)
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#"+this.listId+"_"+j).removeClass('fa-star').addClass('fa-star-o');
	}
};

/* *******************Validator************************ */
/** validation and error display on submit **/
/**
*@param array of inputs
*/

var Validator =function(array)
{
	this.msgExist = false;
	this.isValid = true;
	

	if(array.title.length<1)
	{
		this.displayError('Title is required.');
		this.isValid = false;
		return;
	}
	else if (/^[a-zA-Z _0-9-]+$/.test(array.title)===false)
	{
		this.displayError('Only alphabets, numbers and dashes are valid');
		this.isValid = false;
		return;
	}
	else if(array.link.length<1)
	{
		this.displayError('Url is required');
		this.isValid = false;
		return;
	}
};
/** this one function will handly error display and cleanup with a timeout **/

Validator.prototype.displayError = function(errorMsg){
  var that = this;
  var infoDiv = $('#header-info');
  if(this.msgExist === true)
  {
    clearTimeout(this.timeOut);
    infoDiv.html('');

	}else{
		infoDiv.html('<i class="fa fa-ban fa-lg"></i> '+errorMsg);
		that.msgExist = true;
		this.timeOut = setTimeout(function(){
			that.displayError();
		}, 3000);
	}

};

/* **********************validator-end********************* */


var BookmarkGo = function(row)
{
	this.bmBody = $('#bookmarks-body');
	this.currentRow = row;
	this.init();
};

/* takes individual Rows */
/* Binds functions to edit and delete */
BookmarkGo.prototype.init=function()
{
	var that = this;
	var row = this.currentRow;
	this.beingEdited=true;
	var editBtn = row.children('.edit');

	row.children('.delete').on('click', function(){
		return that.bmDelete();
	});
	editBtn.on('click', function(){
		return that.bmEdit();
	});
	
};


BookmarkGo.prototype.bmEdit = function()
{
	
	var that = this;
	var oldElements = this.currentRow.children();
	this.savedElements = oldElements.clone(true);

	var groupMg = new GroupManager();
	this.groupArray = groupMg.getGroupArray();

	var link = '';

	$.each(oldElements, function(i, val){

		if($(val).hasClass('num'))
		{
			var action = $('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num');
			action.attr('data-num', $(val).text());
			$(val).replaceWith(action);

		}

		else if($(val).is("a"))
		{
			var titleSpan = $(this).children();
			var title = $("<input>").attr({type:"text", 'data-url':$(val).attr('href')}).addClass('title')
				.val(titleSpan.html());

			link = $(val).attr('href');
			titleSpan.replaceWith(title);
			title.unwrap();
		}

		else if($(val).hasClass('stars'))
		{
			var list = $(this).children('.ratingList');
			var count = list.data('rating');
		
			var idForRatingList = list.attr('id');
			$(val).children().remove();
			
			var ratingList = $('<span>').addClass('ratingList').attr('id', 'ratingList'+idForRatingList)
			.attr('data-rating', count);
			for(var j=0; j<5;j++)
			{
				if(j<count)
					ratingList.append($('<i class="fa tara fa-star"></i>'));
				else
					ratingList.append($('<i class="fa tara fa-star-o"></i>'));
			}
			var newRatWidg = new ratingWidget(ratingList, count);
			$(val).append(ratingList);

		}
		else if($(val).hasClass('edit'))
		{
			var btn = $(this);
			btn.off();
			btn.removeClass('blue').addClass('green')
			.html('<i class="fa fa-save fa-lg">').click(function(){
				return that.saveEdit();
			});
		}

		else if($(val).hasClass('group'))
		{
			var prevSelected = $(val).text().toUpperCase();

			var groupSelect = $('<select>').attr('name', 'groupSelect');
			for(var k=1; k<that.groupArray.length; k+=2)
			{

				if(prevSelected==that.groupArray[k])
				{
					$('<option>').val(that.groupArray[k])
					.text(that.groupArray[k]).attr("selected", true)
					.appendTo(groupSelect);
				}
				else
				{
					groupSelect.append($('<option>').val(that.groupArray[k])
					.text(that.groupArray[k]));
				}

			}
			$(val).text("").append(groupSelect);

		}
		else if($(val).hasClass('delete')){
			

			var bttn = $(this);
			bttn.off();
			var icon = $('<i class="fa fa-minus-circle fa-lg">');

			bttn.text('').append(icon).on('click', function(){
				return that.cancelEdit();
			});
		
		}
	});
	var linkDiv=$('<div>').html('<i class="fa fa-link"></i>')
							.addClass('actionIndicator num');
	var linkSpan=$("<input>").attr({type:"text", name:"link"}).addClass('title').val(link);
	this.currentRow.append(linkDiv);
	this.currentRow.append(linkSpan);

};

BookmarkGo.prototype.cancelEdit=function()
{
	this.currentRow.children().remove();
	this.currentRow.append(this.savedElements);
};



BookmarkGo.prototype.postEdit = function()
{
  var that = this;
  var inputs = that.collectedInputs;
  var validator = new Validator(inputs);
  if(!validator.isValid)
  {
    
    that.cancelEdit();
    return;
  }
  
  var bmId = this.currentRow.attr('id').split("_")[1];
  var request = $.ajax({
    type:'POST',
    data:{id:bmId, title:inputs.title, link:inputs.link, group_id:inputs.group_id, stars:inputs.stars},
    url:'action/update'
  });
  
  request.done(function(){
    var newRow = buildRowFromObject(inputs);
    newRow.attr('id', 'bookmark_'+bmId);
    var initialize = new BookmarkGo(newRow);
    that.currentRow.replaceWith(newRow);
    renumberRows();
  });
  request.fail(function(){
    that.cancelEdit();
  });
  
};

BookmarkGo.prototype.saveEdit=function()
{
	var that = this;
	this.collectedInputs={};

	$.each(this.currentRow.children(), function(i, val){
    var val = $(val);
		switch(i){
			case 1:
			{
				that.collectedInputs.title = val.val();
				break;
			}
			case 2:
			{	

				var ratingList = val.children();
				var starCount = ratingList.data('rating');
				ratingList.children().off();
				that.collectedInputs.stars = starCount;
				break;

			}
			case 3:
			{
				var groupSpan = val;
				var selected = groupSpan.children().find('option:selected').val().toUpperCase();
				var key = that.groupArray.indexOf(selected)-1;
				that.collectedInputs.group_id = parseInt(that.groupArray[key]);
				break;
			}
			case 7:
			{
				that.collectedInputs.link = val.val();
				break;
			}
		
			default:
				break;
			}

	});

	that.postEdit();
	
};

BookmarkGo.prototype.bmDelete=function()
{
	var that = this;
	var bmId = this.currentRow.attr('id').split("_")[1];
	
	var request = $.ajax({
		type:'POST',
		data:{id:bmId},
		url:'action/delete'

	}).done(function(){
		that.currentRow.remove();
		renumberRows();
	}).fail(function(){
		that.cancelEdit();
	});
	
};

/* **************************************************** */
/* ***********Bookmark edit-delete functionalities complete */

/* **********BM-Header-Controls************************ */


var ToolBar = function(){
	this.toolBarChecker=true;
	this.grpBarChecker = true;
	this.addBtn = $('#bmAddBtn');
	this.grpAddBtn = $('#grpAddBtn');

	this.plusIcon = $('<i class="fa fa-plus fa-lg"></i>');
	this.minusIcon = $('<i class="fa fa-minus fa-lg"></i>');
	this.addBtn.on('click', $.proxy(this.addInputBar, this));
	this.grpAddBtn.on('click', $.proxy(this.initiateGrpAdd, this));
};
/* -------Group functionality-------- */

ToolBar.prototype.initiateGrpAdd=function(){

	var that = this;
	if(this.grpBarChecker)
	{
		this.grpAddBtn.css({display:'none', zIndex:'-1'});
		that.grpFormSpan = $('<span>').addClass('grpForm').css('zIndex', 10);
		var inputElem = $('<input>').attr({type:"text", id:"newGrp", placeholder:"group name...", size:14})
			.addClass('grpInput').on('keyup', function(){

				/** The input box will do validation on the fly **/
				var input = $(this).val();
				var bool = /^[a-zA-Z\s_0-9]+$/.test(input);
				if(!bool)
					$(this).val(input.substr(0, input.length-1));
				if(input.length>28)
				{
					alert('Max-length allowed is 28');
					$(this).val(input.substr(0, 28));
				}
			});
		var saveBtn = $('<span>').addClass('btn green').html('<i class="fa fa-save"></i>')
		.click(function(){
			return that.groupSave();
		});
		var delBtn = $('<span>').addClass('btn red').html('<i class="fa fa-trash-o"></i>')
			.click(function(){
				that.grpFormSpan.css({display:'none', zIndex:'-1'});
				that.grpAddBtn.css({display:'', zIndex:'10'});
			});


		that.grpFormSpan.append(inputElem).append(saveBtn).append(delBtn);
		$('#header-controls').append(that.grpFormSpan);
		this.grpBarChecker=false;
	}else{
		this.grpAddBtn.css({display:'none', zIndex:'-1'});
		$('.grpForm').css({display:'', zIndex:'10'}).find('input').val("");
	}
	
};


ToolBar.prototype.groupSave=function(){
	var val = $("#newGrp").val();
	if(val.length===0)
		return;
	var that = this;
	var request = $.ajax({
		type:'POST',
		url:'action/new-group',
		data:{group:val},
		dataType:'json'
	})

	.done(function(data){
		var grpSpan = $('<span>').attr('id', 'group_'+data.grpId).addClass('bookmarkGroups')
			.text(data.group);
		$(".appInfo").append(grpSpan);
		that.grpFormSpan.css({display:'none', zIndex:'-1'});
		that.grpAddBtn.css({display:'', zIndex:'10'});
		var rowMg = new RowManager();
	});

};
/* --xxxxxxxx---group functionality end--xxxxxxxxx-- */


/* ----Row functionality-----*/

ToolBar.prototype.addInputBar=function()
{
	if(!this.toolBarChecker) //so that we only execute this once
		return;				//only one adding bar needed at any given point
	var that=this;

	/* getting the group array */
	var groupMg = new GroupManager();
	this.groupArray = groupMg.getGroupArray();

	var rowDiv=$('<div>').addClass('row');
	var numDiv=$('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num first');
	var titleSpan = $("<input>").attr({type:"text", name:"title", placeholder:"Title/description"})
				.addClass('title');

	var idForRatingList = this.getNewRowCount()+1;
	
	var ratingList = $('<span>').addClass('ratingList').attr('id', 'ratingList'+idForRatingList);
	for(var i=0; i<5;i++)
	{
		ratingList.append($('<i class="fa tara fa-star-o"></i>'));
	}

	var newRatWidg = new ratingWidget(ratingList, 0);
	var starSpan = $('<span>').addClass('stars').append(ratingList);

	var groupSpan = $('<span>').addClass('group');
	var groupSelect = $('<select>').attr('name', 'groupSelect');
	for(var j=0; j<this.groupArray.length; j++)
	{

		if(j%2!==0)
			groupSelect.append($('<option>').val(this.groupArray[j]).text(this.groupArray[j]));
	}
	groupSpan.append(groupSelect);
	var saveBtn = $('<span>').addClass('btn green edit').html('<i class="fa fa-save fa-lg">')
		.on('click', function(){
			return that.saveRowInput();
		});
	var cancelBtn = $('<span>').addClass('btn red delete').text('')
	.append($('<i class="fa fa-minus-circle fa-lg">')).click(function(){
		return that.delRowInput();
	});

	var linkDiv=$('<div>').html('<i class="fa fa-link"></i>')
							.addClass('actionIndicator num');
	var linkSpan=$("<input>").attr({type:"text", name:"link", placeholder:"link.."})
			.addClass('title');

	rowDiv.append(numDiv).append(titleSpan).append(starSpan).append(groupSpan)	
	.append(saveBtn).append(cancelBtn).append(linkDiv).append(linkSpan);
	
	$("#bookmarks-body").prepend(rowDiv);
	this.row = rowDiv;
	this.toolBarChecker = false;
};


ToolBar.prototype.getNewRowCount=function()
{
	var existingRows = $(".row");
	if(existingRows.length<1)
		return "1";
	else{
		return existingRows.length;
	}
};

ToolBar.prototype.saveRowInput=function()
{
	this.collectedInputs={};
	var that = this;

	//that.newRowToSave=$("<div>").addClass('row');


	$.each(this.row.children(), function(i, val){
		var val = $(val);
		switch(i)
		{

			case 1:
			{
				that.collectedInputs.title = val.val();
				break;
			}
			case 2:
			{
				var ratingList = val.children();
				ratingList.children().off();
				var starCount = ratingList.children('.fa-star').length;
				that.collectedInputs.stars = starCount;
				break;
			}
			case 3:
			{
				var groupSpan = $(val);
				var selected = groupSpan.children().find('option:selected').val().toUpperCase();
				var key = that.groupArray.indexOf(selected)-1;
				that.collectedInputs.group_id = parseInt(that.groupArray[key]);
				break;
			}
			case 7:
			{
				that.collectedInputs.link = val.val();
        break;
			}
			default:
				break;
		}
		
	});

	this.postSaveRowInput();

};

ToolBar.prototype.postSaveRowInput=function()
{
	var that = this;
	var inputs = that.collectedInputs;
	var validator = new Validator(inputs);
	if(!validator.isValid)
	{
		
		this.newRowToSave.remove();
		this.row.remove();
		this.addInputBar();
		that.toolBarChecker=true;
		return;
	}
	var request=$.ajax({
		type:'POST',
		data:{title:inputs.title, link:inputs.link, stars:inputs.stars, group_id:inputs.group_id},
		url:'action/new'
	});

	request.done(function(data){
		var newRow = buildRowFromObject(inputs);
		newRow.attr('id', 'bookmark_'+data);
		that.row.replaceWith(newRow);
		that.toolBarChecker=true;
		var newR = new BookmarkGo(newRow);
		var rowM = new RowManager();
		var d = true;
		renumberRows();
	});

};

ToolBar.prototype.delRowInput = function(){
	this.row.remove();
	this.toolBarChecker=true;
};




/* Functionality to manage group selections */
/** will keep track of ids of different groups **/

var GroupManager = function()
{
	var that = this;
	this.groupArray=[];

	$.each($('span.bookmarkGroups'), function(i, val){
		var number = $(val).attr('id').split("_")[1];
		var group = $(val).text().toUpperCase();
		that.groupArray.push(number);
		that.groupArray.push(group);
	});	
};

GroupManager.prototype.getGroupArray=function()
{
	return this.groupArray;
};



/** This will handle filtering of rows on select **/

var RowManager = function()
{
	var groupMg = new GroupManager();

	this.groupArray = groupMg.getGroupArray();
	this.filteredList = [];
	this.init();
};

RowManager.prototype.init = function(){
	var select = $('#groupSelect');
	select.children(':not(:first)').remove();
	$.each($('.bookmarkGroups'), function(i, val){
		var groupName = $(val).text();
		$('<option>').attr('val', groupName).text(groupName)
			.appendTo(select);
	});
};
RowManager.prototype.filter=function(hello)
{
	var that = this;
	var index = this.groupArray.indexOf(hello.toUpperCase());
	if(hello.toUpperCase()=='Group'.toUpperCase())
		var groupId = "all";
	else
		var groupId = this.groupArray[index-1];

	var request = $.ajax({
		type:'GET',
		url:'action/filter-by-group',
		data:{group_id:groupId},
		dataType:'json'
	})

	.done(function(data){
		$('#bookmarks-body').empty()
			.append(data.map(buildRowFromObject));
		prepRows();
		renumberRows();
	});

	
};


/* search box functionality */

$("#searchIconId").click(function(){
	var searchForm = $("#searchForm");
	searchForm.toggleClass('expandwidth');
	var searchField = $('#search');
	searchField.on('keyup', function(){
		var input = $(this).val();
		suggestBookmarks(input);
	});

});

function suggestBookmarks(str)
{
	var keyword = str;
	if(str==="")
		keyword = 'all';

	var request = $.ajax({
		type:'GET',
		data:{keyword:keyword},
		url:'action/search',
		dataType:'json'
	})

	.done(function(data){
		var rowBody = $('#bookmarks-body');
		rowBody.empty();
		for(var i = 0; i<data.length; i++)
		{
			var row = buildRowFromObject(data[i]);
			rowBody.append(row);
		}
		prepRows();
		renumberRows();
	});

}
/* Search box functionality end */


var rowMgInitialize = new RowManager();

$("#groupSelect").on('change', function(){
	var rowName = $(this).find('option:selected').val();
	rowMgInitialize.filter(rowName);
});
$("#filterIconId").click(function(){
	$('#filterBox').toggleClass('expandFilter');
});




/* Global functions that should be available to all classes */
/** should probably refactor it out into a global object or something but
this is the final form of the project so this is it **/

var prepRows = function(){
	var count = 0;
	$.each($('.row'), function(i, val){
		var name = new BookmarkGo($(val));
		count++;
	});
	return count;
};
var renumberRows = function(){
	$.each($('#bookmarks-body').children('.row'), function(i, val){
		var row = $(this);
		var count = i+1;
		row.find('.num').text(count+".");
	});
	
};

/** This will turn a JSON object into a row**/
/** The object is a response from the server to an ajax request **/

var buildRowFromObject = function(bookmark)
{
	var groupMg = new GroupManager();
	var groupArray = groupMg.getGroupArray();

	var newRow=$("<div>").addClass('row').attr('id', 'bookmark_'+bookmark.id);
	
	$('<span>').addClass('num').appendTo(newRow);

	var titleSpan=$('<span>').addClass('title').text(bookmark.title);
	$('<a>').attr({href:bookmark.link, target:'_blank'}).append(titleSpan)
		.appendTo(newRow);

	var count = parseInt(bookmark.stars);
	var ratingList = $('<span>').addClass('ratingList').attr('id', 'ratingList'+bookmark.id)
	.attr('data-rating', count);
	for(var i=0; i<5;i++)
	{
		if(i<count)
			ratingList.append($('<i class="fa tara fa-star"></i>'));
		else
			ratingList.append($('<i class="fa tara fa-star-o"></i>'));
	}
	//var newRatWidg = new ratingWidget(ratingList, count);
	$('<span>').addClass('stars').append(ratingList).appendTo(newRow);
	
	var bmId = bookmark.group_id.toString();
	var grpIndex = groupArray.indexOf(bmId)+1;

	$('<span>').addClass('group').text(groupArray[grpIndex])
		.appendTo(newRow);

	$('<span>').addClass('btn blue edit').html('<i class="fa fa-edit fa-lg">')
		.appendTo(newRow);

	$('<span>').addClass('btn red delete').html('<i class="fa fa-trash-o">')
		.appendTo(newRow);

	return newRow;
};


/* End Global Classes */




/* misc end */

$(document).ready(function(){
	
	var init = prepRows();
	var tl = new ToolBar();

	if(init===0)
		$("#bmAddBtn").trigger("click");

	var check = new GroupManager();

	(function(){
		$('.intro').on('mouseover', function(){
			$(this).find('.headerLogo').html('<i class="fa fa-star"></i>');
		}).on('mouseout', function(){
			$(this).find('.headerLogo').html('<i class="fa fa-star-o"></i>');
		});
	}());
	
});