/* ************* The Rating Widget ************************** */
/**************************************************************/

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
		//console.log(this);
		$(star).attr('id', that.listId+"_"+i).css('cursor', 'pointer');
		$(star).on('mouseover', function(){ return that.rateOver( i ) });
		$(star).click(function(){ return that.rateClick( i ) });
	});
	this.ratingList.on('mouseout', $.proxy(this.rateOut, this));
}
// ratingWidget.prototype.rateClick=function(i)
// {
// 	var that = this;
// 	var request = $.ajax({
// 		type:"POST",
// 		data:{ rating: i+1 },
// 		url:'action/rating'
// 	})
// 	.done(function(data)
// 	{	
// 		that.postClick(i);
// 	})
// 	.fail(function(data, textStatus, errorThrown){
// 		console.log(errorThrown);
// 		console.log('what');

// 	});
// }
ratingWidget.prototype.rateOver=function(i)
{
	for(var j=0; j<5; j++)
	{
		if(j<=i)
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$('#'+this.listId+"_"+j).addClass('fa-star-o');
	}
}
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
}


ratingWidget.prototype.rateOut=function()
{
	for(var j = 0; j < 5; j++)
	{
		if(j<this.count)
			$("#rating_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#rating_"+j).removeClass('fa-star').addClass('fa-star-o');
	}
}

/* ************* The End ************************************ */
/**************************************************************/



var BookmarkGo = function(row)
{
	var that = this;
	this.bmBody = $('#bookmarks-body');
	this.currentRow = row;
	this.init();
}

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
	
}

/* what a monstrosity */
BookmarkGo.prototype.bmEdit = function()
{
	if(!this.beingEdited)
		return;
	var that = this;
	var oldElements = this.currentRow.children();
	this.savedElements = oldElements.clone(true);

	this.beindEdited=false;
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
			titleSpan.replaceWith(title);
			title.unwrap();
		}

		else if($(val).hasClass('stars'))
		{
			var list = $(this).children();
			var count = list.data('rating');
			var ratWidg = new ratingWidget(list, count);

		}
		else if($(val).hasClass('edit'))
		{
			var btn = $(this);
			btn.off();
			btn.removeClass('blue').addClass('green')
			.text('Save').click(function(){
				return that.saveEdit();
			});
		}
		else if($(val).hasClass('delete')){
			// var btn = $(this);
			// btn.off();
			// btn.text('cancel').on('click', $.proxy(that.bmDelete, this.currentRow));

			var btn = $(this);
			btn.off();
			var icon = $('<i class="fa fa-minus-circle fa-lg">');
			// btn.text('cancel').on('click', function(){
			// 	return that.cancelEdit();
			// });
			btn.text('').append(icon).on('click', function(){
				return that.cancelEdit();
			});
		
		}
	});

}
BookmarkGo.prototype.cancelEdit=function()
{
	this.currentRow.children().remove();
	this.currentRow.append(this.savedElements);
}

BookmarkGo.prototype.collectValues=function()
{
	/* this will collect values before new post creations or edits */
}

BookmarkGo.prototype.saveEdit = function()
{
	

	this.postEdit();
}
BookmarkGo.prototype.postEdit=function()
{
	var that = this;
	$.each(this.currentRow.children(), function(i, val){
		var val = $(val);
		if(val.hasClass('num'))
		{
			var count = val.data('num');
			var numSpan = $('<span>').attr('data-num', count)
				.addClass('num').text(count);
			val.replaceWith(numSpan);
		}

		else if(val.hasClass('title'))
		{
			var titleSpan = $('<span>').addClass('title').text(val.val());
			var link = $('<a>').attr({ href: val.data('url'), target:"_blank"});
			link.append(titleSpan);
			val.replaceWith(link);
		}

		else if(val.hasClass('stars'))
		{
			var ratingList = val.children();
			ratingList.children('tara').off();;

		}

		else if(val.hasClass('edit'))
		{
			val.off();
			val.removeClass('green').addClass('blue')
				.text('Edit').click(function(){
					return that.bmEdit();
				});
		}
		else if(val.hasClass('delete'))
		{
			val.off();
			var icon = $('<i class="fa fa-times fa-lg">');
			val.text('').append(icon).click(function(){
				return that.bmDelete();
			});
		}

	});
	
}

BookmarkGo.prototype.bmDelete=function()
{
	this.currentRow.remove();
}

/* **************************************************** */
/* ***********Bookmark edit-delete functionalities complete */
/* *********************************************************** */



/* **********BM-Header-Controls************************ */


var ToolBar = function(){
	this.toolBarChecker=true;
	this.addBtn = $('.bmAddBtn');
	this.plusIcon = $('<i class="fa fa-plus fa-lg"></i>');
	this.minusIcon = $('<i class="fa fa-minus fa-lg"></i>');
	this.addBtn.on('click', $.proxy(this.addInputBar, this));
}

ToolBar.prototype.addInputBar=function()
{
	if(!this.toolBarChecker)
		return;
	var that=this;
	var rowDiv=$('<div>').addClass('row');
	var numDiv=$('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num first');
	var titleSpan = $("<input>").attr({type:"text", name:"title"}).addClass('title');

	var idForRatingList = this.getNewRowCount()+1;
	
	var ratingList = $('<span>').addClass('ratingList').attr('id', 'ratingList'+idForRatingList)
	for(var i=0; i<5;i++)
	{
		ratingList.append($('<i class="fa tara fa-star-o"></i>'));
	}

	var newRatWidg = new ratingWidget(ratingList, 0);
	var starSpan = $('<span>').addClass('stars').append(ratingList);

	var groupSpan = $('<span>').addClass('group').text('1');
	var saveBtn = $('<span>').addClass('btn green edit').text('Save')
		.on('click', function(){
			return that.saveRowInput();
		})
	var cancelBtn = $('<span>').addClass('btn red delete').text('')
	.append($('<i class="fa fa-minus-circle fa-lg">')).click(function(){
		return that.delRowInput();
	});

	var linkDiv=$('<div>').html('<i class="fa fa-link"></i>')
							.addClass('actionIndicator num');
	var linkSpan=$("<input>").attr({type:"text", name:"link"}).addClass('title');
	rowDiv.append(numDiv).append(titleSpan).append(starSpan).append(groupSpan)	
	.append(saveBtn).append(cancelBtn).append(linkDiv).append(linkSpan);
	
	$("#bookmarks-body").prepend(rowDiv);
	this.row = rowDiv;
	this.toolBarChecker = false;
}
ToolBar.prototype.saveRowInput=function()
{


	this.postSaveRowInput();
}
ToolBar.prototype.getNewRowCount=function()
{
	var existingRows = $(".row");
	if(existingRows.length<1)
		return "1.";
	else{
		return existingRows.length;
	}
}
ToolBar.prototype.postSaveRowInput=function()
{
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
				ratingList.attr('data-rating', starCount);
				$('<span>').addClass('stars').append(ratingList)
				.appendTo(that.newRowToSave);
				break;
			}
			case 3:
			{
				var groupSpan = $(val);
				that.newRowToSave.append(groupSpan);
				break;
			}
			case 4:
			{
				$(val).off().text('Edit')
				.removeClass('green').addClass('blue')
				.appendTo(that.newRowToSave);
				break;
			}
			case 5:
			{
				$(val).off().text('').html('<i class="fa fa-times fa-lg">')
					.appendTo(that.newRowToSave);
					break;
			}
			default:
				break;
		}
		// {
		// }

	});
	this.row.replaceWith(that.newRowToSave);
	this.toolBarChecker=true;
	var newRow = new BookmarkGo(that.newRowToSave);

}
ToolBar.prototype.delRowInput = function(){
	this.row.remove();
	this.toolBarChecker=true;
}

var prepRows = function(){
	$.each($('.row'), function(i, val){
		var name = new BookmarkGo($(val));
	});
}
$(document).ready(function(){
	prepRows();
	//var bm = new BookmarkGo();
	var tl = new ToolBar;

	//var check = new ratingWidget('ratingList');
})