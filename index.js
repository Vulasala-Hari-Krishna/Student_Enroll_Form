var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var empDBName = 'SCHOOL-DB';
var empRelationName = 'STUDENT-TABLE';
var conntoken = '90932563|-31949277790930202|90949373';

$('#rollno').focus();
resetForm();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}
function validateData(){
    var rollno,studentname,Class,birth_date,adress,enroll_date;
    rollno = $('#rollno').val();
    studentname = $('#studentname').val();
    Class = $('#Class').val();
    birth_date = $('#birth_date').val();
    adress = $('#adress').val();
    enroll_date = $('#enroll_date').val();

    if (rollno === ''){
        alert("Roll Number missing");
        $('#rollno').focus();
        return "";
    }

    if (studentname === ''){
        alert("Student Name missing");
        $('#studentname').focus();
        return "";
    }

    if (Class === ''){
        alert("Class missing");
        $('#Class').focus();
        return "";
    }

    if (birth_date === ''){
        alert("Date of Birth missing");
        $('#birth_date').focus();
        return "";
    }

    if (adress === ''){
        alert("Adress is missing");
        $('#adress').focus();
        return "";
    }

    if (enroll_date === ''){
        alert("Enrollment Date missing");
        $('#enroll_date').focus();
        return "";
    }
    var jsonStrObj = {
        roll_no : rollno,
        studentname : studentname,
        Class : Class,
        Date_of_birth : birth_date,
        adress : adress,
        enrollment_date : enroll_date
    };
    return JSON.stringify(jsonStrObj)
}
function resetForm(){
    $('#rollno').val("");
    $('#studentname').val("");
    $('#Class').val("");
    $('#birth_date').val("");
    $('#adress').val("");
    $('#enroll_date').val("");
    $('#rollno').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#rollno').focus();
}
function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj===''){
        return "";
    }
    var putRequest = createPUTRequest(conntoken,jsonStrObj,empDBName,empRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#rollno').focus();
}
function updateData(){
    $('#update').prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(conntoken,jsonChg,empDBName,empRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}
function getRollNoAsJsonObj(){
    var rollno = $('#rollno').val();
    var jsonStr = {
        roll_no : rollno
    }
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#studentname').val(record.studentname);
    $('#Class').val(record.Class);
    $('#birth_date').val(record.Date_of_birth);
    $('#adress').val(record.adress);
    $('#enroll_date').val(record.enrollment_date);

}
function getStudent(){
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(conntoken,empDBName,empRelationName,rollNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status === 400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#rollno').focus();
    } else if (resJsonObj.status === 200){
        $('#rollno').prop('disabled',true);
        fillData(resJsonObj);
        $('#save').prop('disabled',true);
        $('#update').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#studentname').focus();
    }
}