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
		if(j<this.starCount)
			$("#"+this.listId+"_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#"+this.listId+"_"+j).removeClass('fa-star').addClass('fa-star-o');
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
	
	var that = this;
	var oldElements = this.currentRow.children();
	this.savedElements = oldElements.clone(true);
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
			for(var i=0; i<5;i++)
			{
				if(i<count)
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
			.text('Save').click(function(){
				return that.saveEdit();
			});
		}
		else if($(val).hasClass('delete')){
			

			var btn = $(this);
			btn.off();
			var icon = $('<i class="fa fa-minus-circle fa-lg">');

			btn.text('').append(icon).on('click', function(){
				return that.cancelEdit();
			});
		
		}
	});
	var linkDiv=$('<div>').html('<i class="fa fa-link"></i>')
							.addClass('actionIndicator num');
	var linkSpan=$("<input>").attr({type:"text", name:"link"}).addClass('title').val(link);
	this.currentRow.append(linkDiv);
	this.currentRow.append(linkSpan);

}
BookmarkGo.prototype.cancelEdit=function()
{
	this.currentRow.children().remove();
	this.currentRow.append(this.savedElements);
}



BookmarkGo.prototype.postEdit = function()
{
	var that = this;
 	var inputs = that.collectedInputs;
 	var bmId = this.currentRow.attr('id').split("_")[1];
 	//console.log(inputs);
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

}
BookmarkGo.prototype.saveEdit=function()
{
	var that = this;
	that.collectedInputs=[];
/* just a hack to not collect extra stuff on edit */


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
				that.collectedInputs.push(1);
				break;
			}
			case 4:
			{
				val.off();
				val.removeClass('green').addClass('blue')
					.text('Edit').click(function(){
						return that.bmEdit();
					});
				break;
			}
			case 5:
			{
				val.off();
				var icon = $('<i class="fa fa-times fa-lg">');
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
	
}

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

	}).fail(function(){
		that.cancelEdit();
	})
	
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
	var titleSpan = $("<input>").attr({type:"text", name:"title", placeholder:"Title/description"})
				.addClass('title');

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
	var linkSpan=$("<input>").attr({type:"text", name:"link", placeholder:"link.."})
			.addClass('title')

	rowDiv.append(numDiv).append(titleSpan).append(starSpan).append(groupSpan)	
	.append(saveBtn).append(cancelBtn).append(linkDiv).append(linkSpan);
	
	$("#bookmarks-body").prepend(rowDiv);
	this.row = rowDiv;
	this.toolBarChecker = false;
}


ToolBar.prototype.getNewRowCount=function()
{
	var existingRows = $(".row");
	if(existingRows.length<1)
		return "1";
	else{
		return existingRows.length;
	}
}
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
				that.collectedInputArray.push(1);
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

	this.postSaveRowInput();

}

ToolBar.prototype.postSaveRowInput=function()
{
	var that = this;
	var inputs = that.collectedInputArray;

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
	})



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


/* Functionality to manage group selections */
var GroupManager = function()
{

}

$(document).ready(function(){
	prepRows();
	//var bm = new BookmarkGo();
	var tl = new ToolBar();

	//var check = new ratingWidget('ratingList');
})