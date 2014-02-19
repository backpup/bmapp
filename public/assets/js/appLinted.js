/* ************* The Rating Widget ************************** */
/**************************************************************/


/**
*@param ratingList - a span that has star spans
*@param toggle - if the widget already exists, it's current rating
*/
var ratingWidget = function(ratingList, toggle)
{
	var that = this;
	if(arguments.length==2)
		this.starCount = toggle;
	else
		this.starCount=0;
	this.ratingList = ratingList;
	this.listId = this.ratingList.attr('id');



	$.each(this.ratingList.find('.tara'), function(i, star){
	
		$(star).attr('id', that.listId+"_"+i).css('cursor', 'pointer');
		$(star).on('mouseover', function(){ return that.rateOver( i ); });
		$(star).click(function(){ return that.rateClick( i ); });
	});
	this.ratingList.on('mouseout', $.proxy(this.rateOut, this));
};

ratingWidget.prototype.rateOver=function(i)
{
	for(var j=0; j<5; j++)
	{
		if(j<=i)
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$('#'+this.listId+"_"+j).addClass('fa-star-o');
	}
};

ratingWidget.prototype.rateClick=function(i)
{
	var current = i;
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

/* ************* The End ************************************ */
/**************************************************************/


/* *******************The Validator************************ */

/**
*@desc opens wut
*/


var Validator =function(array, isGroup)
{
	this.msgExist = false;
	this.isValid = true;
	var ct = 0;
	(isGroup)? ct=1: ct=2;
	for(var i = 0; i<ct; i++)
	{
		switch(i)
		{
			case 0:
			{
				if(array[0].length<1)
				{
					this.displayError('Title is required.');
					this.isValid = false;
					return;
				}else if (/^[a-zA-Z _0-9-]+$/.test(array[0])===false)
				{
					this.displayError('Only alphabets, numbers and dashes are valid');
					this.isValid = false;
					return;
				}
				break;
			}
			case 1:
			{
				if(array[1].length<1)
				{
					this.displayError('Url is required.');
					this.isValid=false;
					return;
				}
				break;
			}
		}
	}
};

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
	var that = this;
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
	//console.log(this.currentRow);
	this.beingEdited=true;
	var editBtn = row.children('.edit');

	//row.children('.delete').on('click', $.proxy(that.bmDelete, row));
	row.children('.delete').on('click', function(){
		return that.bmDelete();
	});
	editBtn.on('click', function(){
		return that.bmEdit();
	});
	
};

/* what a monstrosity */
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
			for(var k=0; k<that.groupArray.length; k++)
			{

				if(k%2!==0)
				{
					if(prevSelected==that.groupArray[k])
						$('<option>').val(that.groupArray[k])
						.text(that.groupArray[k]).attr("selected", true)
						.appendTo(groupSelect);
					else
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
    //that.currentRow.children().last().remove();
    return;
  }
  
  var bmId = this.currentRow.attr('id').split("_")[1];
  var request = $.ajax({
    type:'POST',
    data:{id:bmId, title:inputs[0], link:inputs[1], group_id:inputs[3], stars:inputs[2]},
    url:'action/update'
  });
  
  request.done(function(){
    that.currentRow.children().last().remove();
    that.currentRow.children().last().remove();
  });
  request.fail(function(){
    that.cancelEdit();
  });
  
};

BookmarkGo.prototype.saveEdit=function()
{
	var that = this;
	that.collectedInputs=[];



	$.each(this.currentRow.children(), function(i, val){
		var val = $(val);

		switch(i){

			case 0:
			{
				var count = val.data('num');
				var numSpan = $('<span>').attr('data-num', count)
					.addClass('num').text(count);
				val.replaceWith(numSpan);
				break;
			}
			case 1:
			{
				that.collectedInputs.push(val.val());

				var link = that.currentRow.children('.title').last().val();
				var titleSpan = $('<span>').addClass('title').text(val.val());
				var a = $('<a>').attr({href:link, target:"_blank"});
				a.append(titleSpan);
				val.replaceWith(a);

				that.collectedInputs.push(link);
				break;
			}
			case 2:
			{	
				var ratingList = val.children();
				var starCount = ratingList.data('rating');
				ratingList.children().off();
				that.collectedInputs.push(ratingList.data('rating'));
				break;

			}
			case 3:
			{

				var groupSpan = $(val);
				var selected = groupSpan.children().find('option:selected').val().toUpperCase();
				var key = that.groupArray.indexOf(selected)-1;
				groupSpan.text(selected);
				that.collectedInputs.push(parseInt(that.groupArray[key]));
				break;
			}
			case 4:
			{
				val.off();
				val.removeClass('green').addClass('blue')
					.html('<i class="fa fa-edit fa-lg">').click(function(){
						return that.bmEdit();
					});
				break;
			}
			case 5:
			{
				val.off();
				var icon = $('<i class="fa fa-trash-o">');
				val.text('').append(icon).click(function(){
					return that.bmDelete();
				});
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
/* *********************************************************** */



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
			groupSelect.append($('<option>').val(this.groupArray[i]).text(this.groupArray[i]));
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
	this.collectedInputArray=[];
	var that = this;
/* retrieved id will go here */
	that.newRowToSave=$("<div>").addClass('row');
/* grabbing link to wrap title with */
	var linkInput = this.row.children().last().val();
/* Get the count for the row */
	var newRowCount = that.getNewRowCount()+".";
	$.each(this.row.children(), function(i, val){
		var val = $(val);
		switch(i)
		{
			case 0:
			{
				var numSpan = $('<span>')
				.addClass('num').text(newRowCount);
				that.newRowToSave.append(numSpan);
				break;
			}
			case 1:
			{
				that.collectedInputArray.push(val.val());
				that.collectedInputArray.push(linkInput);
				var titleSpan = $('<span>').addClass('title').text(val.val());
				var link = $('<a>').attr({href:linkInput, target:'_blank'});
				link.append(titleSpan);
				that.newRowToSave.append(link);
				break;
			}
			case 2:
			{
				var ratingList = val.children();
				ratingList.children().off();
				var starCount = ratingList.children('.fa-star').length;

				that.collectedInputArray.push(starCount);

				ratingList.attr('data-rating', starCount);
				$('<span>').addClass('stars').append(ratingList)
				.appendTo(that.newRowToSave);
				break;
			}
			case 3:
			{
				var groupSpan = $(val);
				var selected = groupSpan.children().find('option:selected').val().toUpperCase();
				var key = that.groupArray.indexOf(selected)-1;
				that.collectedInputArray.push(parseInt(that.groupArray[key]));
				$('<span>').addClass('group').text(selected)
					.appendTo(that.newRowToSave);
				break;
			}
			case 4:
			{
				$(val).off().html('<i class="fa fa-edit fa-lg">')
				.removeClass('green').addClass('blue')
				.appendTo(that.newRowToSave);
				break;
			}
			case 5:
			{
				$(val).off().text('').html('<i class="fa fa-trash-o">')
					.appendTo(that.newRowToSave);
					break;
			}
			default:
				break;
		}
		// {
		// }
		
	});

	this.postSaveRowInput();

};

ToolBar.prototype.postSaveRowInput=function()
{
	var that = this;
	var inputs = that.collectedInputArray;
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
		data:{title:inputs[0], link:inputs[1], stars:inputs[2], group_id:inputs[3]},
		url:'action/new'
	});

	request.done(function(data){
		that.newRowToSave.attr('id', 'bookmark_'+data);
		that.row.replaceWith(that.newRowToSave);
		that.toolBarChecker=true;
		var newRow = new BookmarkGo(that.newRowToSave);
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



/* Functionality to manage existing rows */
/* will have current row list */
/* one global variable, oh well */
var savedRowList = $("#bookmarks-body").children(".row");

/*###change*/
/* Wont use the global above anymore and will do ajax request */
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

	
};






/* miscellaneous functions  */


/* search box functionality */

$("#searchIconId").click(function(){
	var searchForm = $("#searchForm");
	searchForm.toggleClass('expandwidth');
	var searchField = $('#search');
	searchField.on('keyup', function(){
		var input = $(this).val();
		return suggestBookmarks(input);
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
	var newRatWidg = new ratingWidget(ratingList, count);
	$('<span>').addClass('stars').append(ratingList).appendTo(newRow);

	var grpIndex = groupArray.indexOf(bookmark.group_id)+1;

	$('<span>').addClass('group').text(groupArray[grpIndex])
		.appendTo(newRow);

	$('<span>').addClass('btn blue edit').html('<i class="fa fa-edit fa-lg">')
		.appendTo(newRow);

	$('<span>').addClass('btn red delete').html('<i class="fa fa-trash-o">')
		.appendTo(newRow);

	return newRow;
};


/* End Global Classes */

(function(){
	$('.intro').on('mouseover', function(){
		$(this).find('.headerLogo').html('<i class="fa fa-star"></i>');
	}).on('mouseout', function(){
		$(this).find('.headerLogo').html('<i class="fa fa-star-o"></i>');
	});
}());


/* misc end */

$(document).ready(function(){
	
	var init = prepRows();
	var tl = new ToolBar();

	if(init===0)
		$("#bmAddBtn").trigger("click");

	var check = new GroupManager();
	

});