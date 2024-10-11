$(document).ready(function () {
  $("#gridSection").hide();

  var sampleData = [
    {
      id: 1,
      hoTen: "Nguyễn Văn A",
      gioiTinh: "Nam",
      namSinh: "1990-05-10",
      soCCCD: "123456789",
      noiSinh: "Hà Nội",
      diaChiLienLac: "123 Đường ABC, Quận X, Hà Nội",
      soDienThoai: "0901234567",
      fileUpload: "",
      khoaHoc: [],
    },
    {
      id: 2,
      hoTen: "Trần Thị B",
      gioiTinh: "Nữ",
      namSinh: "1992-09-15",
      soCCCD: "987654321",
      noiSinh: "TP. Hồ Chí Minh",
      diaChiLienLac: "456 Đường XYZ, Quận Y, TP. Hồ Chí Minh",
      soDienThoai: "0907654321",
      fileUpload: "",
      khoaHoc: [],
    },
  ];

  var dataSource = new kendo.data.DataSource({
    data: sampleData,
    schema: {
      model: {
        id: "id",
        fields: {
          hoTen: { type: "string" },
          gioiTinh: { type: "string" },
          namSinh: { type: "date" },
          soCCCD: { type: "string" },
          noiSinh: { type: "string" },
          diaChiLienLac: { type: "string" },
          soDienThoai: { type: "string" },
          fileUpload: { type: "string" },
          khoaHoc: { type: "array" },
        },
      },
    },
    pageSize: 15,
  });

  $("#grid").kendoGrid({
    dataSource: dataSource,
    pageable: true,
    height: 550,
    columns: [
      { selectable: "multiple, row", width: "50px" },
      { field: "hoTen", title: "Họ và tên", width: "150px" },
      { field: "gioiTinh", title: "Giới tính", width: "100px" },
      {
        field: "namSinh",
        title: "Năm sinh",
        width: "120px",
        format: "{0:yyyy-MM-dd}",
      },
      { field: "soCCCD", title: "Số căn cước công dân", width: "150px" },
      { field: "noiSinh", title: "Nơi sinh", width: "150px" },
      { field: "diaChiLienLac", title: "Địa chỉ liên lạc", width: "200px" },
      { field: "soDienThoai", title: "Số điện thoại", width: "150px" },
      {
        field: "fileUpload",
        title: "File đính kèm",
        template: function (dataItem) {
          return dataItem.fileUpload
            ? `<a href="${dataItem.fileUpload}" target="_blank">Xem file</a>`
            : "Không có file";
        },
        width: "150px",
      },
      {
        field: "khoaHoc",
        title: "Khóa học",
        template: function (dataItem) {
          return dataItem.khoaHoc.length > 0
            ? dataItem.khoaHoc.join(", ")
            : "Không có khóa học";
        },
        width: "150px",
      },
    ],
  });

  // Tìm kiếm thông tin sinh viên trong Grid
  $("#search").on("input", function () {
    var value = $(this).val();
    $("#grid")
      .data("kendoGrid")
      .dataSource.filter({
        logic: "or", 
        filters: [
          { field: "hoTen", operator: "contains", value: value },
          { field: "soCCCD", operator: "contains", value: value },
          { field: "soDienThoai", operator: "contains", value: value },
        ],
      });
  });

  $("#showGrid").click(function (e) {
    $("#gridSection").toggle();
  });


  $("#addButton").click(function () {
    $("#dialog").dialog({
      modal: true,
      width: 1366,
      height: 700,
      title: "Thêm sinh viên",
      buttons: {
        Lưu: function () {
          if (!validateForm()) {
            // alert("Vui lòng điền đầy đủ các trường bắt buộc!");
            return;
          }

          var newItem = {
            hoTen: $("#hoTen").val(),
            gioiTinh: $("input[name='gioiTinh']:checked").val(),
            namSinh: $("#namSinh").val(),
            soCCCD: $("#soCCCD").val(),
            noiSinh: $("#noiSinh").val(),
            diaChiLienLac: $("#diaChiLienLac").val(),
            soDienThoai: $("#soDienThoai").val(),
            fileUpload: $("#fileUpload").val()
              ? $("#fileUpload").val().split("\\").pop()
              : "",
            khoaHoc: [],
          };
          $("input[name='khoaHoc']:checked").each(function () {
            newItem.khoaHoc.push($(this).val());
          });
          newItem.id = dataSource.total() + 1;
          dataSource.add(newItem);
          dataSource.sync();
          $("#grid").data("kendoGrid").refresh();
        },
        "Lưu & Đóng": function () {
          if (!validateForm()) {
            // alert("Vui lòng điền đầy đủ các trường bắt buộc!");
            return;
          }

          var newItem = {
            hoTen: $("#hoTen").val(),
            gioiTinh: $("input[name='gioiTinh']:checked").val(),
            namSinh: $("#namSinh").val(),
            soCCCD: $("#soCCCD").val(),
            noiSinh: $("#noiSinh").val(),
            diaChiLienLac: $("#diaChiLienLac").val(),
            soDienThoai: $("#soDienThoai").val(),
            fileUpload: $("#fileUpload").val()
              ? $("#fileUpload").val().split("\\").pop()
              : "",
            khoaHoc: [],
          };
          $("input[name='khoaHoc']:checked").each(function () {
            newItem.khoaHoc.push($(this).val());
          });
          newItem.id = dataSource.total() + 1;
          dataSource.add(newItem);
          dataSource.sync();
          $("#grid").data("kendoGrid").refresh();
          $(this).dialog("close");
        },
        Đóng: function () {
          $(this).dialog("close");
        },
      },
      close: function () {
        $("#studentForm")[0].reset();
      },
    });
  });

  $("#editButton").click(function () {
    var grid = $("#grid").data("kendoGrid");
    var selectedRows = grid.select();

    if (selectedRows.length > 0) {
      var dataItem = grid.dataItem(selectedRows[0]);

      $("#hoTen").val(dataItem.hoTen);
      $("#gioiTinh input[value='" + dataItem.gioiTinh + "']").prop(
        "checked",
        true
      );
      $("#namSinh").val(dataItem.namSinh);
      $("#soCCCD").val(dataItem.soCCCD);
      $("#noiSinh").val(dataItem.noiSinh);
      $("#diaChiLienLac").val(dataItem.diaChiLienLac);
      $("#soDienThoai").val(dataItem.soDienThoai);
      $("input[name='khoaHoc']").prop("checked", false);
      if (dataItem.khoaHoc) {
        dataItem.khoaHoc.forEach(function (khoa) {
          $("input[name='khoaHoc'][value='" + khoa + "']").prop(
            "checked",
            true
          );
        });
      }

      $("#dialog").dialog({
        modal: true,
        width: 1366,
        height: 700,
        title: "Sửa thông tin sinh viên",
        buttons: {
          "Cập nhật": function () {
            if (!validateForm()) {
              return; 
            }
            dataItem.set("hoTen", $("#hoTen").val());
            dataItem.set("gioiTinh", $("input[name='gioiTinh']:checked").val());
            dataItem.set("namSinh", $("#namSinh").val());
            dataItem.set("soCCCD", $("#soCCCD").val());
            dataItem.set("noiSinh", $("#noiSinh").val());
            dataItem.set("diaChiLienLac", $("#diaChiLienLac").val());
            dataItem.set("soDienThoai", $("#soDienThoai").val());
            dataItem.set(
              "fileUpload",
              $("#fileUpload").val()
                ? $("#fileUpload").val().split("\\").pop()
                : ""
            );
            var selectedKhoaHoc = [];
            $("input[name='khoaHoc']:checked").each(function () {
              selectedKhoaHoc.push($(this).val());
            });
            dataItem.set("khoaHoc", selectedKhoaHoc);
            grid.dataSource.sync();
            grid.refresh();

            $(this).dialog("close");
          },
          Đóng: function () {
            $(this).dialog("close");
          },
        },
      });
    } else {
      alert("Vui lòng chọn một sinh viên để sửa thông tin.");
    }
  });

  $("#deleteButton").click(function () {
    var grid = $("#grid").data("kendoGrid");
    var selectedRows = grid.select();

    if (selectedRows.length > 0) {
      if (confirm("Bạn có chắc chắn muốn xóa các bản ghi đã chọn không?")) {
        selectedRows.each(function () {
          var dataItem = grid.dataItem(this);
          grid.dataSource.remove(dataItem);
        });
        grid.dataSource.sync();
      }
    } else {
      alert("Vui lòng chọn ít nhất một hàng để xóa.");
    }
  });
});

function validateForm() {
  var isValid = true;
  var phone = $("#soDienThoai").val();
  var phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone)) {
    isValid = false;
    $("#soDienThoai").addClass("error");
    $("#soDienThoaiError").text(
      "Số điện thoại phải có độ dài 10-11 số và chỉ chứa chữ số."
    );
  } else {
    $("#soDienThoai").removeClass("error");
    $("#soDienThoaiError").text("");
  }

  if (!$("input[name='gioiTinh']:checked").val()) {
    isValid = false;
    $("#gioiTinhError").text("Bạn phải chọn giới tính."); 
  } else {
    $("#gioiTinhError").text(""); 
  var cccd = $("#soCCCD").val();
  var cccdRegex = /^[0-9]{12}$/;
  if (!cccdRegex.test(cccd)) {
    isValid = false;
    $("#soCCCD").addClass("error");
    $("#soCCCDError").text("Số CCCD phải có 12 chữ số.");
  } else {
    $("#soCCCD").removeClass("error");
    $("#soCCCDError").text(""); 
  }

  var birthDate = $("#namSinh").val();
  if (new Date(birthDate) == "Invalid Date" || birthDate === "") {
    isValid = false;
    $("#namSinh").addClass("error");
    $("#namSinhError").text("Vui lòng nhập ngày sinh hợp lệ."); 
  } else {
    $("#namSinh").removeClass("error");
    $("#namSinhError").text(""); 
  }

  function validateRequiredField(fieldId, errorId) {
    var value = $(fieldId).val().trim();
    if (value === "") {
      isValid = false;
      $(fieldId).addClass("error");
      $(errorId).text("Vui lòng điền đủ thông tin");
    } else {
      $(fieldId).removeClass("error");
      $(errorId).text("");
    }
  }
  validateRequiredField("#hoTen", "#hoTenError");
  validateRequiredField("#diaChiLienLac", "#diaChiError");
  validateRequiredField("#noiSinh", "#noiSinhError");
  return isValid;
}
