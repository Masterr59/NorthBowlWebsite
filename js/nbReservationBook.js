
$(document).ready( function()
{ 
    let todaysDate = new Date(); // 1681974000000
    setDate(todaysDate);
    //display_ct(todaysDate);
    getReservationDay(todaysDate);
}); // end (document).ready


function changeDate()
{
    const changeDateVal = document.getElementById("inputDate").value + '';
    const newDateYear = Number(changeDateVal.substring(0,4));
    const newDateMonth = Number(changeDateVal.substring(5,7));
    const newDateDay = Number(changeDateVal.substring(8,10));

    let nDate = new Date(newDateYear, newDateMonth - 1, newDateDay);
    setDate(nDate);
    getReservationDay(nDate);
}

function setDate(curDate)
{
    const opMonth = { month: "long" };
    const opWeekday = { weekday: "long" };
    const textMonth = new Intl.DateTimeFormat("en-US", opMonth).format(curDate);
    const textDay = curDate.getDate();
    const textWeekday = new Intl.DateTimeFormat("en-US", opWeekday).format(curDate);
    const textYear = curDate.getFullYear();

    $('#displayDate').empty();
    $('#displayDate').append(textWeekday + ', ' + textMonth + ' ' + textDay + ', ' + textYear);
}

function getReservationDay(date) 
{
    let searchRDate = date.getTime();
    console.log(searchRDate);
    //$.get("http://www.northbowlspokane.glcapis.com/leaguesAPI.php", { getType:"mainSite" }, buildLeaguesArray, "json");
    $.get("https://localhost/APIs/northbowlAPI/reservationsBookAPI.php", { getType:"mainSite", rDate: searchRDate }, function(reservations, status){
        console.log("Get status: " + status + "\n");
        buildReservationBook(reservations, status, date);
    }, "json");
}

function buildReservationBook(reservations, status, date)
{
    $('#reservationBook').empty(); // Make sure book is reset...

    if (reservations === undefined || !reservations === Array || reservations.length === 0)
        reservations = new Array();

    let lanesCount = 24; // Default amount of lanes
    let gridStartHour = 10; // Default grid start
    let gridEndHour = 2; // Default grid end

    // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    let startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), gridStartHour, 0);
    let endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, gridEndHour, 0);;

    let reservationTableHTML = buildHeader(lanesCount);

    // Body...
    reservationTableHTML += '<tbody>';

    // While indicates how many rows there will be by default.
    let curTime = new Date(startTime);
    while (curTime.getTime() <= endTime.getTime())
    {
        reservationTableHTML += '<tr>';

        let formattedGridTime = formatGridTime(curTime);

        reservationTableHTML += '<th scope="row">' + formattedGridTime + '</th>';

        // For indicates the table date for each row (columns)
        for (let laneNum = 1; laneNum <= lanesCount; laneNum++)
        {
            let findReservationIX = findReservation(curTime, laneNum, reservations);
            if (findReservationIX >= 0)
            {
                reservationTableHTML += "<td>";
                reservationTableHTML += "<button id=\"tester" + reservations[findReservationIX]["rID"] + "\" type=\"button\" onclick=\"alert('Hello world!')\" style=\"background-color:#" + reservations[findReservationIX]["rBGColor"] + "\";\" data-rID=\"" + reservations[findReservationIX]["rID"] + "\">Click Me!</button> </td>";
                console.log(reservations[findReservationIX]["rID"] + "\n");
            }

            else
                reservationTableHTML += '<td></td>';
        }

        reservationTableHTML += '<th scope="row">' + formattedGridTime + '</th>';
        reservationTableHTML += '</tr>';
        curTime = addMinutes(curTime, 30);
    }

    // Close the table...
    reservationTableHTML += '</tbody>';
    reservationTableHTML += '</table>';
    $('#reservationBook').append(reservationTableHTML);
    console.log($('#tester1').data('rID'));
}

function findReservation(curTime, laneNum, reservations)
{
    // init reservation Data...
    let reservationStart, reservationEnd, reservationLaneStart, reservationLaneEnd, reservIndex;
    let inReservationTimeZone, inReservationLaneZone;
    if (reservations != null && reservations.length > 0)
    {
        for (let ix = 0; ix < reservations.length; ix++)
        {
            reservationStart = new Date(reservations[ix]["rDate"]);
            reservationEnd = new Date(reservations[ix]["rDate"]);
            reservationStart.setHours(reservations[ix]["rStartHour"], reservations[ix]["rStartMinute"]);
            reservationEnd.setHours(reservations[ix]["rEndHour"], reservations[ix]["rEndMinute"]);
            reservationLaneStart = reservations[ix]["rStartLane"];
            reservationLaneEnd = reservations[ix]["rEndLane"];

            inReservationTimeZone = curTime.getTime() >= reservationStart.getTime() && curTime.getTime() < reservationEnd.getTime();
            inReservationLaneZone = laneNum >= reservationLaneStart && laneNum <= reservationLaneEnd;
            if (inReservationTimeZone && inReservationLaneZone)
                return ix;
        }
    }

    return -1;
}

function buildHeader(lanesCount)
{
    let tableHeader = '<table table-responsive class="table table-striped table-bordered table-hover table-sm" style="font-size: 12px; ">';
    tableHeader += '<thead class="thead-light">';
    tableHeader += '<tr>';
    tableHeader += '<th scope="col">Time</th>';
    for (let ix = 1; ix <= lanesCount; ix++)
    {
        tableHeader += '<th scope="col">Lane <br>' + ix + '</th>';
    }

    tableHeader += '<th scope="col">Time</th>';
    tableHeader += '</tr>';
    tableHeader += '</thead>';
    return tableHeader;
}

function formatGridTime(dateTime)
{
    let timeHour = 0;
    let timeMinute = '00';
    let amPM = 'am';

    if (dateTime.getHours() > 12)
        timeHour = dateTime.getHours() - 12;
    else if (dateTime.getHours() == 0)
        timeHour = 12;
    else
        timeHour = dateTime.getHours();
    if (dateTime.getMinutes() == 0)
        timeMinute = '00';
    else
        timeMinute = dateTime.getMinutes();
    if (dateTime.getHours() >= 12)
        amPM = 'pm';
    else
        amPM = 'am';
    
    return timeHour + ':' + timeMinute + ' ' + amPM;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function getMonthText(monthNum)
{
    switch(monthNum)
    {
        case '0': return 'January';
        case '1': return 'February';
        case '2': return 'March';
        case '3': return 'April';
        case '4': return 'May';
        case '5': return 'June';
        case '6': return 'July';
        case '7': return 'August';
        case '8': return 'September';
        case '9': return 'October';
        case '10': return 'November';
        case '11': return 'December';
        default: 'MONTH ERROR';
    }
}

function display_c()
{
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)
 }
 
 function display_ct(clockDate) 
 {
   var newDate = clockDate.toDateString(); 
   newDate = newDate + " - " + clockDate.toLocaleTimeString();
   document.getElementById('ct').innerHTML = newDate;
   display_c();
 }
