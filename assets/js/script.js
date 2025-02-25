let departmentFilterValue = 0;
let locationFilterValue = 0;
let previousSearch = '';
$(window).on('load', function () {
    loader(false);
});

$(document).ready(function () {
    getAllPersonnel(); 
});

/* OnLoad Loader starts */
function loader(isOnOff) {
    if(isOnOff === true) {
        $('#preloader').show();
    } else {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).hide();
        });
    }
}
/* OnLoad Loader ends */

/* All Personnel Data starts */
function getAllPersonnel() {
    let userInput = $('#searchInp').val();

    // Load Data for Personnel 
    $.ajax({
        url: "php/personnel/getAllPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            locationFilter: locationFilterValue,
            departmentFilter: departmentFilterValue,
            searchValue: userInput
        },
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    
                    let frag = document.createDocumentFragment();
                    result.data.forEach(allData => {

                        let row = document.createElement("tr");

                        // name
                        let tdName = document.createElement("td");
                        tdName.classList = "align-middle text-nowrap";
                        let tdNameText = document.createTextNode(allData.lastName+", "+allData.firstName);
                        tdName.append(tdNameText);

                        row.append(tdName);

                        // department
                        let tdDept = document.createElement("td");
                        tdDept.classList = "align-middle text-nowrap d-none d-md-table-cell";
                        let tdDeptText = document.createTextNode(allData.department);
                        tdDept.append(tdDeptText);

                        row.append(tdDept);

                        // location
                        let tdLocation = document.createElement("td");
                        tdLocation.classList = "align-middle text-nowrap d-none d-md-table-cell";
                        let tdLocationText = document.createTextNode(allData.location);
                        tdLocation.append(tdLocationText);

                        row.append(tdLocation);

                        // email
                        let tdEmail = document.createElement("td");
                        tdEmail.classList = "align-middle text-nowrap d-none d-md-table-cell";
                        let tdEmailText = document.createTextNode(allData.email);
                        tdEmail.append(tdEmailText);

                        row.append(tdEmail);

                        // action
                        let tdAction = document.createElement("td");
                        tdAction.classList = "text-end text-nowrap";

                        // yes
                        let buttonYes = document.createElement("button");
                        buttonYes.setAttribute("type", "button");
                        buttonYes.classList = "btn btn-primary btn-sm me-1";
                        buttonYes.setAttribute("data-bs-toggle", "modal");
                        buttonYes.setAttribute("data-bs-target", "#editPersonnelModal");
                        buttonYes.setAttribute("data-id", allData.id);

                        let iTagYes = document.createElement("i");
                        iTagYes.classList = "fa-solid fa-pencil fa-fw";
                        buttonYes.append(iTagYes);

                        // no
                        let buttonNo = document.createElement("button");
                        buttonNo.setAttribute("type", "button");
                        buttonNo.classList = "btn btn-primary btn-sm";
                        buttonNo.setAttribute("data-bs-toggle", "modal");
                        buttonNo.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
                        buttonNo.setAttribute("data-id", allData.id);

                        let iTagNo = document.createElement("i");
                        iTagNo.classList = "fa-solid fa-trash fa-fw";
                        buttonNo.append(iTagNo);

                        tdAction.append(buttonYes);
                        tdAction.append(buttonNo);
                        row.append(tdAction);
                        
                        frag.append(row);
                    });
                    $("#personnelTableBody").empty().append(frag);

                } else {
                    let frag = document.createDocumentFragment();

                    let tdTag = document.createElement("td");
                    tdTag.classList = "align-middle text-nowrap text-center py-2";
                    tdTag.setAttribute("colspan", "5");
                    let tdTagText = document.createTextNode("No Data Available");
                    tdTag.append(tdTagText);

                    frag.append(tdTag);
                    $("#personnelTableBody").empty().append(frag);
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let tdTag = document.createElement("td");
                tdTag.classList = "align-middle text-nowrap text-center py-2";
                tdTag.setAttribute("colspan", "5");
                let tdTagText = document.createTextNode("No Data Available");
                tdTag.append(tdTagText);

                frag.append(tdTag);
                $("#personnelTableBody").empty().append(frag);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            
        }
    });
}
/* All Personnel Data starts */

/* Get Department starts */
function getDepartment() {
    
    $.ajax({
        url: "php/department/getAllDepartment.php",
        type: "GET",
        dataType: "json",
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    let frag = document.createDocumentFragment();
                    result.data.forEach(deptData => {
                        let optionTag = document.createElement("option");
                        optionTag.setAttribute("value", deptData.id);
                        let optionTagText = document.createTextNode(deptData.name);
                        optionTag.append(optionTagText);

                        frag.append(optionTag);
                    });
                    $("#addPersonnelDepartment").empty().append(frag);

                } else {
                    let frag = document.createDocumentFragment();

                    let optionTag = document.createElement("option");
                    let optionTagText = document.createTextNode("No Data Available");
                    optionTag.append(optionTagText);

                    frag.append(optionTag);

                    $("#addPersonnelDepartment").empty().append(frag);
                    
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let optionTag = document.createElement("option");
                let optionTagText = document.createTextNode("No Data Available");
                optionTag.append(optionTagText);

                frag.append(optionTag);

                $("#addPersonnelDepartment").empty().append(frag);
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            
        }
    });
    
}
/* Get Department ends */

/* All Department Data starts */
function getAllDepartment() {
    
    $.ajax({
        url: "php/department/getAllDepartment.php",
        type: "GET",
        dataType: "json",
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    
                    let frag = document.createDocumentFragment();
                    result.data.forEach(deptData => {

                        let row = document.createElement("tr");
                        
                        // name
                        let tdName = document.createElement("td");
                        tdName.classList = "align-middle text-nowrap";
                        tdName.setAttribute("data-id", deptData.id);
                        let tdNameText = document.createTextNode(deptData.name);
                        tdName.append(tdNameText);

                        row.append(tdName);

                        // location
                        let tdLocation = document.createElement("td");
                        tdLocation.classList = "align-middle text-nowrap d-none d-md-table-cell";
                        let tdLocationText = document.createTextNode(deptData.location);
                        tdLocation.append(tdLocationText);

                        row.append(tdLocation);

                        // action
                        let tdAction = document.createElement("td");
                        tdAction.classList = "text-end text-nowrap";
                        let editButton = document.createElement("button");
                        editButton.setAttribute("type", "button");
                        editButton.classList = "btn btn-primary btn-sm me-1";
                        
                        editButton.setAttribute("data-bs-toggle", "modal");
                        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                        editButton.setAttribute("data-id", deptData.id);
                        let editButtonIcon = document.createElement("i");
                        editButtonIcon.classList = "fa-solid fa-pencil fa-fw";

                        tdAction.append(editButton);
                        editButton.append(editButtonIcon);

                        let deleteButton = document.createElement("button");
                        deleteButton.setAttribute("type", "button");
                        deleteButton.classList = "btn btn-primary btn-sm removeDepartmentBtn";                        
                        deleteButton.setAttribute("data-id", deptData.id);
                        let deleteButtonIcon = document.createElement("i");
                        deleteButtonIcon.classList = "fa-solid fa-trash fa-fw";

                        tdAction.append(deleteButton);
                        deleteButton.append(deleteButtonIcon);
                        row.append(tdAction);

                        frag.append(row);
                    });
                    $('#departmentTableBody').empty().append(frag);

                } else {
                    let frag = document.createDocumentFragment();

                    let tdTag = document.createElement("td");
                    tdTag.classList = "align-middle text-nowrap text-center py-2";
                    tdTag.setAttribute("colspan", "5");
                    let tdTagText = document.createTextNode("No Data Available");
                    tdTag.append(tdTagText);

                    frag.append(tdTag);
                    $("#departmentTableBody").empty().append(frag);
                    
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let tdTag = document.createElement("td");
                tdTag.classList = "align-middle text-nowrap text-center py-2";
                tdTag.setAttribute("colspan", "5");
                let tdTagText = document.createTextNode("No Data Available");
                tdTag.append(tdTagText);

                frag.append(tdTag);
                $("#departmentTableBody").empty().append(frag);
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            
        }
    });
    
}
/* All Department Data ends */

/* Remove Department Button click starts */
$(document).on("click",".removeDepartmentBtn",function(e){
    let deptID = $(this).data('id');
        $.ajax({
            url: "php/department/getDepartmentData.php",
            type: "GET",
            dataType: "json",
            data: {
                id: deptID
            },
            success: function (result) {
                if (result.status.code === "200") {
                    if (result.data.length !== 0) {
                        if(result.data[0].personnelCount === 0) {
                            // allow delete
                            $("#areYouSureDepartmentModal .modal-title").text("Remove department?");
                            $("#department-name").text(result.data[0].name);
                            $("#departmentID").val(deptID);
                            $("#areYouSureDepartmentModal").modal("show");
                        } else {
                            // do not allow delete
                            $("#cantRemoveDepartmentModal .modal-title").text("Cannot remove department ...");
                            $("#personnelCount").text(result.data[0].personnelCount);
                            $("#cantDeleteDeptName").text(result.data[0].name);
                            $("#cantRemoveDepartmentModal").modal("show");
                        }
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
});
/* Remove Department Button click ends */

/* Get Location starts */
function getLocation() {
    
    $.ajax({
        url: "php/location/getAllLocation.php",
        type: "GET",
        dataType: "json",
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    let frag = document.createDocumentFragment();
                    result.data.forEach(locData => {
                        let optionTag = document.createElement("option");
                        optionTag.setAttribute("value", locData.id);
                        let optionTagText = document.createTextNode(locData.name);
                        optionTag.append(optionTagText);

                        frag.append(optionTag);
                    });
                    $("#addDepartmentLocation").empty().append(frag);
                } else {
                    let frag = document.createDocumentFragment();

                    let optionTag = document.createElement("option");
                    let optionTagText = document.createTextNode("No Data Available");
                    optionTag.append(optionTagText);

                    frag.append(optionTag);
                    $("#addDepartmentLocation").empty().append(frag);
                    
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let optionTag = document.createElement("option");
                let optionTagText = document.createTextNode("No Data Available");
                optionTag.append(optionTagText);

                frag.append(optionTag);
                $("#addDepartmentLocation").empty().append(frag);
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            
        }
    });
}
/* Get Location ends */

/* All Location Data starts */
function getAllLocation() {
    
    $.ajax({
        url: "php/location/getAllLocation.php",
        type: "GET",
        dataType: "json",
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    let frag = document.createDocumentFragment();
                    result.data.forEach(locData => {

                        let tr = document.createElement("tr");
                        
                        // name
                        let tdName = document.createElement("td");
                        tdName.classList = "align-middle text-nowrap";
                        let tdNameText = document.createTextNode(locData.name);
                        tdName.append(tdNameText);

                        tr.append(tdName);

                        // action
                        let tdAction = document.createElement("td");
                        tdAction.classList = "text-end text-nowrap";
                        
                        // edit
                        let editButton = document.createElement("button");
                        editButton.classList = "btn btn-primary btn-sm me-1";
                        editButton.setAttribute("data-bs-toggle", "modal");
                        editButton.setAttribute("data-bs-target", "#editLocationModal");
                        editButton.setAttribute("data-id", locData.id);
                        
                        let editIcon = document.createElement("i");
                        editIcon.classList = "fa-solid fa-pencil fa-fw";
                        editButton.append(editIcon);

                        // delete
                        let deleteButton = document.createElement("button");
                        deleteButton.classList = "btn btn-primary btn-sm remove-location";
                        deleteButton.setAttribute("data-id", locData.id);
                        
                        let deleteIcon = document.createElement("i");
                        deleteIcon.classList = "fa-solid fa-trash fa-fw";
                        deleteButton.append(deleteIcon);

                        tdAction.append(editButton);
                        tdAction.append(deleteButton);

                        tr.append(tdAction);
                        frag.append(tr);
                    });
                    $("#locationTableBody").empty().append(frag);

                } else {
                    let frag = document.createDocumentFragment();

                    let tdTag = document.createElement("td");
                    tdTag.classList = "align-middle text-nowrap text-center py-2";
                    tdTag.setAttribute("colspan", "5");
                    let tdTagText = document.createTextNode("No Data Available");
                    tdTag.append(tdTagText);

                    frag.append(tdTag);
                    $("#locationTableBody").empty().append(frag);
                    
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let tdTag = document.createElement("td");
                tdTag.classList = "align-middle text-nowrap text-center py-2";
                tdTag.setAttribute("colspan", "5");
                let tdTagText = document.createTextNode("No Data Available");
                tdTag.append(tdTagText);

                frag.append(tdTag);
                $("#locationTableBody").empty().append(frag);
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            
        }
    });
    
}
/* All Location Data ends */

/* Remove Location Button click starts */
$(document).on("click",".remove-location",function(e){
    let locID = $(this).data('id');
        $.ajax({
            url: "php/location/getLocationData.php",
            type: "GET",
            dataType: "json",
            data: {
                id: locID
            },
            success: function (result) {
                if (result.status.code === "200") {
                    if (result.data.length !== 0) {
                        if(result.data[0].departmentCount === 0) {
                            // allow delete
                            $("#areYouSureLocationModal .modal-title").text("Remove location?");
                            $("#locationName").text(result.data[0].name);
                            $("#locationID").val(locID);
                            $("#areYouSureLocationModal").modal("show");
                        } else {
                            // do not allow delete
                            $("#cantRemoveLocationModal .modal-title").text("Cannot remove location ...");
                            $("#departmentCount").text(result.data[0].departmentCount);
                            $("#cantDeleteLocationName").text(result.data[0].name);
                            $("#cantRemoveLocationModal").modal("show");
                        }
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { }
        });
});
/* Remove Location Button click ends */

/* Filter Data starts */
function filterData() {
    $.ajax({
        url: "php/filter/getAllFilters.php",
        type: "GET",
        dataType: "json",
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    let deptFrag = document.createDocumentFragment();
                    let optionDept = document.createElement("option");
                    optionDept.setAttribute("value", 0);
                    let optionDeptText = document.createTextNode("All");
                    optionDept.append(optionDeptText);
                    deptFrag.append(optionDept);
                    result.data.department.forEach(deptData => {

                        let option = document.createElement("option");
                        if (deptData.id === departmentFilterValue) {
                            option.setAttribute("selected", "selected");
                        }

                        option.setAttribute("value", deptData.id);
                        let optionText = document.createTextNode(deptData.name);
                        option.append(optionText);
                        deptFrag.append(option);
                    });
                    $("#filterPersonnelByDepartment").empty().append(deptFrag);
                    
                    let locFrag = document.createDocumentFragment();
                    let optionLoc = document.createElement("option");
                    optionLoc.setAttribute("value", 0);
                    let optionLocText = document.createTextNode("All");
                    optionLoc.append(optionLocText);
                    locFrag.append(optionLoc);
                    result.data.location.forEach(locData => {

                        let option = document.createElement("option");
                        if (locData.id === locationFilterValue) {
                            option.setAttribute("selected", "selected");
                        }
                        
                        option.setAttribute("value", locData.id);
                        let optionText = document.createTextNode(locData.name);
                        option.append(optionText);
                        locFrag.append(option);
                    });
                    $("#filterPersonnelByLocation").empty().append(locFrag);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
}
/* Filter Data ends */

/* Search Input Data starts */
$("#searchInp").on("keyup", function () {
    
    let userInput = $(this).val();
    
    if (userInput.trim() !== "" && (userInput.trim()).length >= 3) {
        previousSearch = userInput.trim();
        if ($("#personnelBtn").hasClass("active")) {
            searchFilter(userInput.trim(), 1);
        } else {
            if ($("#departmentsBtn").hasClass("active")) {
                searchFilter(userInput.trim(), 2);
            } else {
                searchFilter(userInput.trim(), 3);
            }
        }
        
        
    } else if (userInput.trim() === "" && previousSearch !== "") {
        previousSearch = userInput.trim();
        if ($("#personnelBtn").hasClass("active")) {
            getAllPersonnel();
        } else {
            if ($("#departmentsBtn").hasClass("active")) {
                getAllDepartment();
            } else {
                getAllLocation();
            }
        }
    }

});
/* Search Input Data ends */

/* Search Filter starts */
function searchFilter(searchValue, searchType) {
    
    $.ajax({
        url: "php/search/searchAll.php",
        type: "POST",
        dataType: "json",
        data: {
            search: searchValue,
            searchType: searchType,
            departmentFilter: departmentFilterValue,
            locationFilter: locationFilterValue
        },
        success: function (result) {

            if (result.status.code === "200") {
                if (result.data.found.length !== 0) {
                    
                    let rows = '';
                    if (searchType === 1) {
                        let frag = document.createDocumentFragment();
                        result.data.found.forEach(allData => {
                            let row = document.createElement("tr");

                            // name
                            let tdName = document.createElement("td");
                            tdName.classList = "align-middle text-nowrap";
                            let tdNameText = document.createTextNode(allData.lastName+", "+allData.firstName);
                            tdName.append(tdNameText);

                            row.append(tdName);

                            // department
                            let tdDept = document.createElement("td");
                            tdDept.classList = "align-middle text-nowrap d-none d-md-table-cell";
                            let tdDeptText = document.createTextNode(allData.departmentName);
                            tdDept.append(tdDeptText);

                            row.append(tdDept);

                            // location
                            let tdLocation = document.createElement("td");
                            tdLocation.classList = "align-middle text-nowrap d-none d-md-table-cell";
                            let tdLocationText = document.createTextNode(allData.locationName);
                            tdLocation.append(tdLocationText);

                            row.append(tdLocation);

                            // email
                            let tdEmail = document.createElement("td");
                            tdEmail.classList = "align-middle text-nowrap d-none d-md-table-cell";
                            let tdEmailText = document.createTextNode(allData.email);
                            tdEmail.append(tdEmailText);

                            row.append(tdEmail);

                            // action
                            let tdAction = document.createElement("td");
                            tdAction.classList = "text-end text-nowrap";

                            // yes
                            let buttonYes = document.createElement("button");
                            buttonYes.setAttribute("type", "button");
                            buttonYes.classList = "btn btn-primary btn-sm me-1";
                            buttonYes.setAttribute("data-bs-toggle", "modal");
                            buttonYes.setAttribute("data-bs-target", "#editPersonnelModal");
                            buttonYes.setAttribute("data-id", allData.id);

                            let iTagYes = document.createElement("i");
                            iTagYes.classList = "fa-solid fa-pencil fa-fw";
                            buttonYes.append(iTagYes);

                            // no
                            let buttonNo = document.createElement("button");
                            buttonNo.setAttribute("type", "button");
                            buttonNo.classList = "btn btn-primary btn-sm";
                            buttonNo.setAttribute("data-bs-toggle", "modal");
                            buttonNo.setAttribute("data-bs-target", "#areYouSurePersonnelModal");
                            buttonNo.setAttribute("data-id", allData.id);

                            let iTagNo = document.createElement("i");
                            iTagNo.classList = "fa-solid fa-trash fa-fw";
                            buttonNo.append(iTagNo);

                            tdAction.append(buttonYes);
                            tdAction.append(buttonNo);
                            row.append(tdAction);
                            
                            frag.append(row);
                        });
                        $("#personnelTableBody").empty().append(frag);
                    } else if (searchType === 2) {
                        let frag = document.createDocumentFragment();
                        result.data.found.forEach(allData => {
                            let row = document.createElement("tr");
                        
                            // name
                            let tdName = document.createElement("td");
                            tdName.classList = "align-middle text-nowrap";
                            tdName.setAttribute("data-id", allData.id);
                            let tdNameText = document.createTextNode(allData.departmentName);
                            tdName.append(tdNameText);

                            row.append(tdName);

                            // location
                            let tdLocation = document.createElement("td");
                            tdLocation.classList = "align-middle text-nowrap d-none d-md-table-cell";
                            let tdLocationText = document.createTextNode(allData.locationName);
                            tdLocation.append(tdLocationText);

                            row.append(tdLocation);

                            // action
                            let tdAction = document.createElement("td");
                            tdAction.classList = "text-end text-nowrap";
                            let editButton = document.createElement("button");
                            editButton.setAttribute("type", "button");
                            editButton.classList = "btn btn-primary btn-sm me-1";
                            
                            editButton.setAttribute("data-bs-toggle", "modal");
                            editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                            editButton.setAttribute("data-id", allData.id);
                            let editButtonIcon = document.createElement("i");
                            editButtonIcon.classList = "fa-solid fa-pencil fa-fw";

                            tdAction.append(editButton);
                            editButton.append(editButtonIcon);

                            let deleteButton = document.createElement("button");
                            deleteButton.setAttribute("type", "button");
                            deleteButton.classList = "btn btn-primary btn-sm removeDepartmentBtn";                        
                            deleteButton.setAttribute("data-id", allData.id);
                            let deleteButtonIcon = document.createElement("i");
                            deleteButtonIcon.classList = "fa-solid fa-trash fa-fw";

                            tdAction.append(deleteButton);
                            deleteButton.append(deleteButtonIcon);
                            row.append(tdAction);

                            frag.append(row);
                        });
                        $("#departmentTableBody").empty().append(frag);
                    } else {
                        let frag = document.createDocumentFragment();
                        result.data.found.forEach(allData => {
                            let tr = document.createElement("tr");
                        
                            // name
                            let tdName = document.createElement("td");
                            tdName.classList = "align-middle text-nowrap";
                            let tdNameText = document.createTextNode(allData.name);
                            tdName.append(tdNameText);

                            tr.append(tdName);

                            // action
                            let tdAction = document.createElement("td");
                            tdAction.classList = "text-end text-nowrap";
                            
                            // edit
                            let editButton = document.createElement("button");
                            editButton.classList = "btn btn-primary btn-sm me-1";
                            editButton.setAttribute("data-bs-toggle", "modal");
                            editButton.setAttribute("data-bs-target", "#editLocationModal");
                            editButton.setAttribute("data-id", allData.id);
                            
                            let editIcon = document.createElement("i");
                            editIcon.classList = "fa-solid fa-pencil fa-fw";
                            editButton.append(editIcon);

                            // delete
                            let deleteButton = document.createElement("button");
                            deleteButton.classList = "btn btn-primary btn-sm remove-location";
                            deleteButton.setAttribute("data-id", allData.id);
                            
                            let deleteIcon = document.createElement("i");
                            deleteIcon.classList = "fa-solid fa-trash fa-fw";
                            deleteButton.append(deleteIcon);

                            tdAction.append(editButton);
                            tdAction.append(deleteButton);

                            tr.append(tdAction);
                            frag.append(tr);
                        });
                        $("#locationTableBody").empty().append(frag);
                    }

                } else {
                    let frag = document.createDocumentFragment();

                    let tdTag = document.createElement("td");
                    tdTag.classList = "align-middle text-nowrap text-center py-2";
                    tdTag.setAttribute("colspan", "5");
                    let tdTagText = document.createTextNode("No data found");
                    tdTag.append(tdTagText);

                    frag.append(tdTag);
                    if (searchType === 1) {
                        $("#personnelTableBody").empty().append(frag);
                    } else if (searchType === 2) {
                        $("#departmentTableBody").empty().append(frag);
                    } else {
                        $("#locationTableBody").empty().append(frag);
                    }
                }
            } else {
                // toast error show
                let frag = document.createDocumentFragment();

                let tdTag = document.createElement("td");
                tdTag.classList = "align-middle text-nowrap text-center py-2";
                tdTag.setAttribute("colspan", "5");
                let tdTagText = document.createTextNode("Unable to find data");
                tdTag.append(tdTagText);

                frag.append(tdTag);
                if (searchType === 1) {
                    $("#personnelTableBody").empty().append(frag);
                } else if (searchType === 2) {
                    $("#departmentTableBody").empty().append(frag);
                } else {
                    $("#locationTableBody").empty().append(frag);
                }
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
    
}
/* Search Filter starts */

/* Refresh tables starts */
$("#refreshBtn").click(function () {
    $('#searchInp').val('');

    if ($("#personnelBtn").hasClass("active")) {
        getAllPersonnel();
    } else {
        if ($("#departmentsBtn").hasClass("active")) {
            getAllDepartment();
        } else {
            getAllLocation();
        }
    }
    
    
    
});
/* Refresh tables ends */

/* Filter Modal starts */
$("#filterBtn").click(function () {
    filterData();
});
$("#filterPersonnelByDepartment").change(function () {
    departmentFilterValue = $(this).val();
    locationFilterValue = 0;
    $("#filterPersonnelByLocation").val(0);
    getAllPersonnel();
});
$("#filterPersonnelByLocation").change(function () {
    locationFilterValue = $(this).val();
    departmentFilterValue = 0;
    $("#filterPersonnelByDepartment").val(0);
    getAllPersonnel();
});
/* Filter Modal ends */

/* Add functionality for All modules starts */
$("#addBtn").click(function () {
    if ($("#personnelBtn").hasClass("active")) {
        $("#addBtn").attr("data-bs-target", "#addPersonnelModal");
        getDepartment();
    } else {
        if ($("#departmentsBtn").hasClass("active")) {
            $("#addBtn").attr("data-bs-target", "#addDepartmentModal");
            getLocation();
        } else {
            $("#addBtn").attr("data-bs-target", "#addLocationModal");
        }
    }
});
/* Add functionality for All modules ends */

$("#personnelBtn").click(function () {
    $('#searchInp').val('');
    $("#addBtn").attr("data-bs-target", "#addPersonnelModal");
    getAllPersonnel();
    $('#filterBtn').attr("disabled", false);
});

$("#departmentsBtn").click(function () {
    $('#searchInp').val('');
    $("#addBtn").attr("data-bs-target", "#addDepartmentModal");
    getAllDepartment();
    $('#filterBtn').attr("disabled", true);
});

$("#locationsBtn").click(function () {
    $('#searchInp').val('');
    $("#addBtn").attr("data-bs-target", "#addLocationModal");
    getAllLocation();
    $('#filterBtn').attr("disabled", true);
});

/* Add Personnel Modal starts */
$("#addPersonnelModal").on("show.bs.modal", function (e) {
    $("#addPersonnelModal .modal-title").text("Add employee");
    getDepartment();
});
/* Add Personnel Modal ends */

/* Add Personnel starts */
$("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/personnel/createPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#addPersonnelEmployeeID").val(),
            departmentID: $("#addPersonnelDepartment").val(),
            firstName: $("#addPersonnelFirstName").val(),
            lastName: $("#addPersonnelLastName").val(),
            email: $("#addPersonnelEmailAddress").val(),
            jobTitle: $("#addPersonnelJobTitle").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllPersonnel();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#addPersonnelForm .modal-title").text(
                "Error adding data"
            );
        }
    });
    
});
/* Add Personnel ends */

/* Add Personnel Close Modal starts */
$("#addPersonnelModal").on("hidden.bs.modal", function (e) {
    $("#addPersonnelForm")[0].reset();
});
/* Add Personnel Close Modal ends */

/* Get Personnel Modal starts */
$("#editPersonnelModal").on("show.bs.modal", function (e) {
    $("#editPersonnelModal .modal-title").text("Edit employee");
    $.ajax({
        url: "php/personnel/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
                $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

                $("#editPersonnelDepartment").html("");
                $.each(result.data.department, function () {
                    $("#editPersonnelDepartment").append(
                        $("<option>", {
                            value: this.id,
                            text: this.name
                        })
                    );
                });
                $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").text(
                "Error retrieving data"
            );
        }
    });
    
});
/* Get Personnel Modal ends */

/* Edit Personnel starts */
$("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/personnel/updatePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#editPersonnelEmployeeID").val(),
            departmentID: $("#editPersonnelDepartment").val(),
            firstName: $("#editPersonnelFirstName").val(),
            lastName: $("#editPersonnelLastName").val(),
            email: $("#editPersonnelEmailAddress").val(),
            jobTitle: $("#editPersonnelJobTitle").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllPersonnel();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editPersonnelForm .modal-title").text(
                "Error updating data"
            );
        }
    });
    
});
/* Edit Personnel ends */

/* Delete Personnel Modal starts */
$("#areYouSurePersonnelModal").on("show.bs.modal", function (e) {
    $("#areYouSurePersonnelModal .modal-title").text("Remove employee entry?");
    $.ajax({
        url: "php/personnel/getPersonnelData.php",
        type: "GET",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function (result) {
            if (result.status.code === "200") {
                if (result.data.length !== 0) {
                    $("#personnelName").text(result.data[0].firstName+" "+result.data[0].lastName);
                    $("#personnelID").val(result.data[0].id);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toast error show
            $("#areYouSurePersonnelModal .modal-title").text(
                "Error retrieving data"
            );
        }
    });
});
/* Delete Personnel Modal ends */

/* Delete Personnel starts */
$("#deletePersonnelForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/personnel/deletePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#personnelID").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllPersonnel();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#deletePersonnelForm .modal-title").text(
                "Error removing data"
            );
        }
    });
    
});
/* Delete Personnel ends */

/* Add Department Modal starts */
$("#addDepartmentModal").on("show.bs.modal", function (e) {
    $("#addDepartmentModal .modal-title").text("Add department");
    getLocation();
});
/* Add Department Modal ends */

/* Add Department starts */
$("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/department/createDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $("#addDepartmentName").val(),
            locationID: $("#addDepartmentLocation").val()
        },
        success: function (result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $('.btn-close').click();
                getAllDepartment();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#addDepartmentForm .modal-title").text(
                "Error adding data"
            );
        }
    });
    
});
/* Add Department ends */

/* Add Department Close Modal starts */
$("#addDepartmentModal").on("hidden.bs.modal", function (e) {
    $("#addDepartmentForm")[0].reset();
});
/* Add Department Close Modal ends */

/* Edit Department Modal starts */
$("#editDepartmentModal").on("show.bs.modal", function (e) {
    $("#editDepartmentModal .modal-title").text("Edit department");
    $.ajax({
        url: "php/department/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $("#editDepartmentID").val(result.data.department[0].id);
                $("#editDepartmentName").val(result.data.department[0].name);
                $("#editDepartmentLocation").empty();
                $.each(result.data.location, function () {
                    $("#editDepartmentLocation").append(
                        $("<option>", {
                            value: this.id,
                            text: this.name
                        })
                    );
                });
                $("#editDepartmentLocation").val(result.data.department[0].locationID);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editDepartmentModal .modal-title").text(
                "Error retrieving data"
            );
        }
    });
    
});
/* Edit Department Modal ends */

/* Edit Department starts */
$("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/department/updateDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#editDepartmentID").val(),
            name: $("#editDepartmentName").val(),
            locationID: $("#editDepartmentLocation").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllDepartment();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editDepartmentForm .modal-title").text(
                "Error updating data"
            );
        }
    });
    
});
/* Edit Department ends */

/* Delete Department starts */
$("#deleteDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/department/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#departmentID").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                
                getAllDepartment();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#deleteDepartmentForm .modal-title").text(
                "Error removing data"
            );
        }
    });
    
});
/* Delete Department ends */

/* Add Location starts */
$("#addLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/location/createLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $("#addLocationName").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllLocation();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#addLocationForm .modal-title").text(
                "Error adding data"
            );
        }
    });
    
});
/* Add Location ends */

/* Add Location Close Modal starts */
$("#addLocationModal").on("hidden.bs.modal", function (e) {
    $("#addLocationForm")[0].reset();
});
/* Add Location Close Modal ends */

/* Edit Location Modal starts */
$("#editLocationModal").on("show.bs.modal", function (e) {
    $("#editLocationModal .modal-title").text("Edit location");
    $.ajax({
        url: "php/location/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $("#editLocationID").val(result.data[0].id);
                $("#editLocationName").val(result.data[0].name);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editLocationModal .modal-title").text(
                "Error retrieving data"
            );
        }
    });
    
});
/* Edit Location Modal ends */

/* Edit Location starts */
$("#editLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/location/updateLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#editLocationID").val(),
            name: $("#editLocationName").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllLocation();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#editLocationForm .modal-title").text(
                "Error updating data"
            );
        }
    });
    
});
/* Edit Location ends */

/* Delete Location starts */
$("#deleteLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
        url: "php/location/deleteLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#locationID").val()
        },
        success: function (result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $('.btn-close').click();
                getAllLocation();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#deleteLocationForm .modal-title").text(
                "Error removing data"
            );
        }
    });
    
});
/* Delete Location ends */