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

	$.each(this.ratingList.find('.tara'), function(i, star){
		//console.log(this);
		$(star).attr('id', 'rating_'+i).css('cursor', 'pointer');
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
			$("#rating_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#rating_"+j).addClass('fa-star-o');
	}
}
ratingWidget.prototype.rateClick=function(i)
{
	var current = i;
	for(var j = 0; j < 5; j++)
	{
		if(j <=i)
		{
			$('#rating_'+j).removeClass('fa-star-o').addClass('fa-star');
			$('#rating_'+j).off();
		}
		$('#rating_'+j).off();
		//this.ratingList.off('mouseout');
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



var BookmarkGo = function()
{
	var that = this;
	this.bmBody = $('#bookmarks-body');
	this.bmRows = this.bmBody.children('.row');

	for(var i=0; i<this.bmRows.length; i++)(function(row)
	{
		return that.init(that.bmRows[row]);
	}(i));
}

/* takes individual Rows */
/* Binds functions to edit and delete */
BookmarkGo.prototype.init=function(row)
{
	var that = this;
	var row = $(row);
	this.currentRow = row;
	console.log(this.currentRow);

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
	var that = this;
	var oldElements = this.currentRow.children();
	this.savedElements = oldElements.clone(true);
	console.log(oldElements);
	$.each(oldElements, function(i, val){

		if($(val).hasClass('num'))
		{
			var action = $('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num');
			action.attr('data-num', $(this).text());
			$(this).replaceWith(action);
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
			console.log(link);
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
	this.count=true;
	this.addBtn = $('.bmAddBtn');
	this.plusIcon = $('<i class="fa fa-plus fa-lg"></i>');
	this.minusIcon = $('<i class="fa fa-minus fa-lg"></i>');
	this.addBtn.on('click', $.proxy(this.addInputBar, this));
}

ToolBar.prototype.addInputBar=function()
{
	if(!this.count)
		return;
	var that=this;
	var rowDiv=$('<div>').addClass('row');
	var numDiv=$('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num first');
	var titleSpan = $("<input>").attr({type:"text", name:"title"}).addClass('title');

	var ratingList = $('<span>').addClass('ratingList');
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
	this.count = false;
}
ToolBar.prototype.saveRowInput=function()
{


	this.postSaveRowInput();
}

ToolBar.prototype.postSaveRowInput=function()
{
	var that = this;
/* retrieved id will go here */
	that.newRowToSave=$("<div>").addClass('row');
	var linkInput = this.row.children().last().val();
	$.each(this.row.children(), function(i, val){
		var val = $(val);
		switch(i)
		{
			case 0:
			{
				var numSpan = $('<span>')
				.addClass('num').text('2.');
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
				ratingList.children('tara').off;
				$('<span>').addClass('stars').append(ratingList)
				.appendTo(that.newRowToSave);
			}
			case 3:
			{
				var groupSpan = $(val);
				that.newRowToSave.append(groupSpan);
			}
			case 4:
			{
				$(val).off().text('Edit').appendTo(that.newRowToSave);
			}
			case 5:
			{

			}
			case 6:
			{

			}
			case 7:
			{

			}
		}
		// {
		// }

	});
	console.log(that.newRowToSave.children());

}
ToolBar.prototype.delRowInput = function(){
	this.row.remove();
	this.count=true;
}


$(document).ready(function(){
	var bm = new BookmarkGo();
	var tl = new ToolBar;

	//var check = new ratingWidget('ratingList');
})