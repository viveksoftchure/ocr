const BASE_URL = "http://localhost/private/ocr" + "/";
var IS_PREMIUM = true;
const maxFileSize=IS_PREMIUM?20:5;
var image = null;
var detectadsbocker = true;
validImageTypes = IS_PREMIUM
    ? ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/jpe", "image/jfif", "image/jfi", "image/jif", "image/tiff", "image/webp", "application/pdf", "application/srt"]
    : ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
var tool = "";
let imgArr = [];
let imgConvertArr = [];
let sortImgConvertArr = [];
let sortImgArr = [];
let index = 0;
var trt = "";

$(document).ready(function() {
    let copyImgSrc = `${BASE_URL}assets/images/copy.svg`;
    let downloadImgSrc = `${BASE_URL}assets/images/download.svg`;

    $("#file").on("change", function (e) {
        console.log('file');
        let files = e.target.files;
        trt = Object.values(files);
        if (files.length > 0) {
            appendFilesToArray(files);
        }
        $(e.target).val("");
    });

    $(".selected-img-preview").sortable({
        opacity: 0.7,
        tolerance: "pointer",
        axis: "y",
        update: function (event, ui) {
            sortImgArr = [];
            sortImgConvertArr = [];
            var sortedItems = $(this).sortable("toArray", { attribute: "data-id" });
            var itration_val = 0;
            sortedItems.map(function (item) {
                item = parseInt(item);
                sortImgArr.push(imgArr[item]);
                sortImgConvertArr.push(imgConvertArr[item]);
                $(".js-single-img-preview").eq(itration_val).find(".delete-action").attr("data-index", item);
                $(".js-single-img-preview").eq(itration_val).attr("data-id", item);
                itration_val++;
            });
        },
    });
    $(".selected-img-preview").disableSelection();

    $(document).on("click", ".delete-action", function (e) {
        let index = $(e.currentTarget).attr("data-index");
        if (index) {
            index = parseInt(index);
            imgArr.splice(index, 1);
            imgConvertArr.splice(index, 1);
            $(e.currentTarget).closest(".js-single-img-preview").remove();
            if ($(".js-single-img-preview").length == 0) {
                $(".after-img-upload").addClass("d-none");
                $(".upload-section").removeClass("flex-basis-50-per");
            }
        }
        $(".no_of_images").text(imgArr.length);
    });

    $(".start-over-btn").click(function () {
        $(".download-all-btn").addClass("d-none");
        $(".upload-section, #jsShadowRoot").removeClass("d-none");
        $(".upload-section").removeClass("flex-basis-50-per");
        $(".result-waiting, .after-img-upload").addClass("d-none");
        $(".selected-img-preview").empty();
        $(".result-waiting-card").remove();
        imgArr = [];
        imgConvertArr = [];
        index = 0;
    });

    function base64CheckImageExists(base64Data, callback) {
        var img = new Image();
        img.onload = function () {
            callback(true);
        };
        img.onerror = function () {
            callback(false);
        };
        img.src = base64Data;
    }

    var copyTooltipLabel = $("#copyTooltipLabel").val();
    var copiedTooltipLabel = $("#copiedTooltipLabel").val();
    var downloadTooltipLabel = $("#downloadTooltipLabel").val();
    var downloadedTooltipLabel = $("#downloadedTooltipLabel").val();
    function convertTiffToJpgBase64(tiffFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const buffer = e.target.result;
                const tiff = new Tiff({ buffer: buffer });
                const canvas = tiff.toCanvas(0);
                const jpegCanvas = document.createElement("canvas");
                const ctx = jpegCanvas.getContext("2d");
                jpegCanvas.width = canvas.width;
                jpegCanvas.height = canvas.height;
                ctx.drawImage(canvas, 0, 0);
                const jpegBase64 = jpegCanvas.toDataURL("image/jpeg");
                resolve(jpegBase64);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsArrayBuffer(tiffFile);
        });
    }

    function convertWebpFileToJpgBase64(webpFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    const jpgBase64 = canvas.toDataURL("image/jpeg");
                    resolve(jpgBase64);
                };
                img.onerror = function (error) {
                    reject(error);
                };
                img.src = e.target.result;
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(webpFile);
        });
    }

    const appendFilesToArray = (files, type = false) => {
        if (type == true) {
            $(".selected-img-preview").empty();
            index = 0;
        }
        if (imgArr.length == 0) {
            index = 0;
        }

        files = Object.values(files);
        files.forEach(async function (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async (e) => {
                let base64 = e.target.result;
                switch (file.type) {
                    case "image/tiff":
                        base64 = await convertTiffToJpgBase64(file);
                        break;
                    case "image/webp":
                        base64 = await convertWebpFileToJpgBase64(file);
                        break;
                    default:
                        if (base64.includes("application/octet-stream")) {
                            base64 = base64.replace("application/octet-stream", "image/jpg");
                        }
                        break;
                }
                checkAndCreateCard(base64, file);
            };
        });
        sortImgConvertArr = imgConvertArr;
    };

    const checkAndCreateCard = (base64, file) => {
        var img_file_format_check = true;
        base64CheckImageExists(base64, function (exists) {
            if (!exists) {
                if (img_file_format_check) {
                    $("#fileTypeNotAllowPopup").show();
                }
                img_file_format_check = false;
                return false;
            }
            let filesLength = IS_PREMIUM == 1 ? 50 : 3;
            let alreadySelected = $(".js-single-img-preview").length;
            if (alreadySelected + 1 > filesLength) {
                $("#limitExceedModal").show();
                return false;
            }
            let fileSize = (file.size / 1000000).toFixed(2);
            if (fileSize > maxFileSize) {
                $("#fileSizeExceedModal").show();
                return false;
            }
            let fileName = file.name;
            if (!IS_PREMIUM) {
                if (!validImageTypes.includes(file.type)) {
                    var not_support_format = file.type + ": File type not allow";
                    if (img_file_format_check) {
                        $("#fileTypeNotAllowPopup").show();
                    }
                    img_file_format_check = false;
                    return false;
                }
            } else {
                if (!validImageTypes.includes(file.type) && file.type != "") {
                    var not_support_format = file.type + ": File type not allow";
                    if (img_file_format_check) {
                        $("#fileTypeNotAllowPopup").show();
                    }
                    img_file_format_check = false;
                    return false;
                }
            }
            if (index == 0) {
                $(".upload-section").addClass("flex-basis-50-per");
                $(".after-img-upload").removeClass("d-none");
            }
            if (fileName.length > 10) {
                let parts = fileName.split(".");
                let extension = parts.pop();
                let name = parts.join(".");
                fileName = name.substr(0, 10) + "." + extension;
            }
            imgConvertArr.push({ base64: base64, fileName: fileName, fullFile: file, fileType: file.type.split("/").pop() });
            var img_preview_html =
                `<div class="js-single-img-preview"  data-id=${index}>` +
                `<div class="left-preview">` +
                `<div class="left-preview-inner">` +
                `<img src="${BASE_URL}assets/images/icons/drag.svg" class="drag-icon"> ` +
                `<img src="${base64}">` +
                `</div>` +
                `<div class="detail-preview">` +
                `<p class="img-preview-name">${fileName}</p>` +
                `<span class="img-preview-size">${fileSize} MB</span>` +
                `</div>` +
                `</div>` +
                `<div class="right-preview">` +
                `<span class="d-flex align-items-center delete-action" data-index=${index}>` +
                `X</span>` +
                `</div>` +
                `</div>`;
            $(".selected-img-preview").append(img_preview_html);
            imgArr.push(file);
            ++index;
            $(".no_of_images").text(imgArr.length);
        });
    };

    $(document).on("click", ".single_text_copy_btn", (e) => {
        let ind_of_img = e.target.id;
        let text = $("#imagetotext_result" + ind_of_img).val();
        navigator.clipboard.writeText(text);
        $(".copy_tooltip" + ind_of_img).attr("data-tooltip", copiedTooltipLabel);
        setTimeout(() => {
            $(".copy_tooltip" + ind_of_img).attr("data-tooltip", copyTooltipLabel);
        }, 1000);
    });

    $(document).on("click", ".single_download_btn", (e) => {
        let ind_of_img = e.target.id;
        let text = $("#imagetotext_result" + ind_of_img).val();
        $(".download_tooltip" + ind_of_img).attr("data-tooltip", downloadedTooltipLabel);
        setTimeout(() => {
            $(".download_tooltip" + ind_of_img).attr("data-tooltip", downloadTooltipLabel);
        }, 1000);
        var img_name = sortImgConvertArr[ind_of_img].fileName;
        var for_txt_file_name = img_name.substring(0, img_name.lastIndexOf(".")) + ".txt";
        const link = document.createElement("a");
        const content = text;
        const file = new Blob([content], { type: "text/plain" });
        link.href = URL.createObjectURL(file);
        link.download = for_txt_file_name;
        link.click();
        URL.revokeObjectURL(link.href);
    });

    $(document).on("click", ".download-all-btn", (e) => {
        var zip = new JSZip();
        $(".result-waiting-card").each(function (index, element) {
            let text = $(element).find(".img-text").val();
            let file_txt_name = $(element).find(".img-title span").text();
            zip.file(file_txt_name.substring(0, file_txt_name.lastIndexOf(".")) + "_" + index + ".txt", text);
        });
        zip.generateAsync({ type: "blob" }).then(function (blob) {
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = "files.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    });

    const DownloadDOC = (selector, type = "doc", content = null) => {
        if (content == null) {
            var text = $(selector).text();
        } else {
            var text = content;
        }
        if (type == "doc") {
            var filename = "imagetotext.doc";
        } else if (type == "text") {
            var filename = "imagetotext.txt";
        } else {
            alert("Error! Please Try Again.");
            return;
        }
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    
    var xhr_array = [];
    let text_not_found_img = `${BASE_URL}assets/images/text-not-found-img.svg`;
    var text_not_found_html =
        `<div class="text_not_found">` + `<img src="${text_not_found_img}">` + `<div>` + `<b>` + $("#notTextFoundHeadingLabel").val() + `</b>` + `<p>` + $("#notTextFoundDetailLabel").val() + `</p>` + `</div>` + `</div>`;
    const tooManyRequestHTML = `<div class="text_not_found">` + `<img src="${text_not_found_img}">` + `<div>` + `<b>` + `ToO Many Request` + `</b>` + `</div>` + `</div>`;
    function ajaxCall(base64, imgname, count, fullFile, fileType) {
        let data = new FormData();
        data.append("base64Image", base64);
        data.append("imgname", imgname);
        data.append("tool", tool);
        data.append("count", count);
        xhr = $.ajax({
            method: "POST",
            url: BASE_URL + "process_ocr.php",
            timeout: 0,
            contentType: false,
            processData: false,
            mimeType: "multipart/form-data",
            data: data,
            success: function (response) {
                response = JSON.parse(response);
                var result_text = response.text.trim();
                if (result_text == "") {
                    $("#imagetotext_result" + response.count)
                        .parent()
                        .append(text_not_found_html);
                    $("#imagetotext_result" + response.count).attr("readonly", true);
                    $("#imagetotext_result" + response.count).css({ resize: "none" });
                } else {
                    $(".for_result_text").html(response.text);
                    var textarea_text = $(".for_result_text").text();
                    $("#imagetotext_result" + response.count).val(textarea_text);
                    $(".copy_download" + response.count).removeClass("d-none");
                    if (textarea_text.split("\n").length < 6) {
                        $("#imagetotext_result" + response.count).css({ resize: "none" });
                    }
                }
                $("#progress" + response.count).addClass("d-none");
            },
            error: function (errors) {
                if (errors.status == 429) {
                    $(".imagetotext-progress:not(.d-none)").parent().append(tooManyRequestHTML);
                    $(".imagetotext-progress:not(.d-none)").attr("readonly", true);
                    $(".imagetotext-progress:not(.d-none)").addClass("d-none");
                }
            },
        });
        xhr_array.push(xhr);
    }

    function imageToTextConverter() {
        if (imgArr.length == 0) {
            return false;
        }
        if (imgArr.length > 1) {
            $(".download-all-btn").removeClass("d-none");
            if ($("#jsZipScript").length == 0) {
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js";
                s.async = true;
                s.defer = true;
                s.setAttribute("id", "jsZipScript");
                $("body").append(s);
            }
        }

        $(".no_of_images").text(imgArr.length);
        $(".after-img-upload, .upload-section, #jsShadowRoot").addClass("d-none");
        $(".result-waiting").removeClass("d-none");

        sortImgConvertArr.forEach((file, count) => {
            var result_waiting_card_html =
                `<div class="result-waiting-card" id="removecard${count}">` +
                `<div class="img-title-text">` +
                `<div class="img-title">` +
                `<img src="${file.base64}" alt="" >` +
                `<span>${file.fileName}</span>` +
                `</div>` +
                `<textarea class="img-text" id="imagetotext_result${count}">` +
                `</textarea>` +
                `</div>` +
                `<div class="img-text-copy-download d-none copy_download${count}">` +
                `<span class="tooltip copy_tooltip${count} d-flex" data-tooltip="${copyTooltipLabel}">` +
                `<img class="single_text_copy_btn" id="${count}" src="${copyImgSrc}" alt="">` +
                `</span>` +
                `<span class="tooltip download_tooltip${count} d-flex" data-tooltip="${downloadTooltipLabel}">` +
                `<img class="single_download_btn" id="${count}" src="${downloadImgSrc}" alt="">` +
                `</span>` +
                `</div>` +
                `<div class="imagetotext-progress" id="progress${count}"></div>` +
                `</div>`;
            $(".result-waiting").append(result_waiting_card_html);
            ajaxCall(file.base64, file.fileName, count, file.fullFile, file.fileType);
            ++count;
        });
    }

    $("#generate_text_btn").on("click", function (e) {
        imageToTextConverter();
    });
});