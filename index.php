<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR Example with Progress Bar</title>
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
</head>
<body>
    <section class="section tool-section">
        <div class="container">
            <h1 class="h1 text-center text-white">Image to Text Converter</h1>
            <p class="text text-center text-white slogan">We present an online OCR (Optical Character Recognition) service to extract text from image. Upload photo to our image to text converter, click on submit and get your text file instantly.</p>
            <div class="tool home tool-grid">
                <div>
                    <div class="tool-span">
                        <div class="tool-area">
                            <div class="upload-section">
                                <div class="before-upload upload-area">
                                    <label>
                                        <img src="assets/images/image.png" alt="image-logo" />
                                    </label>
                                    <span class="drag-n-drop-text" id="js-drag-n-drop">
                                        Upload or Paste image <br />
                                        <small> Upload Up to 50 Images at once </small>
                                    </span>
                                    <label for="file" class="browse-btn">
                                        <img src="assets/images/plus-icon.svg" alt="file upload" />
                                        <span> Browse </span>
                                    </label>
                                    <input type="file" name="file" id="file" hidden="" accept=".jpg,.jpeg,.gif,.png,.bmp,.jpe,.jif,.jfif,.jfi,.webp,.tiff,.tif,.pdf,.srt" multiple="" />
                                    <input hidden="" type="text" name="tool" id="tool-name" value="imagetotext" />
                                    <span class="drag-n-drop-text">
                                        <small>Max Image Size 5 MB</small>
                                    </span>
                                    <div class="url-section">
                                        <div class="url_prepend">
                                            <img src="assets/images/link-icon.svg" alt="image url" height="22" width="22" class="img-fluid" />
                                        </div>
                                        <input type="text" name="url" autocomplete="off" class="file-url" placeholder="Enter a URL" />
                                    </div>
                                </div>
                            </div>
                            <div class="after-img-upload d-none">
                                <div class="selected-img-preview ui-sortable"></div>
                                <div class="images-clear">
                                    <span>Images: <span class="no_of_images">3</span></span>
                                    <span class="start-over-btn">Clear All</span>
                                </div>
                            </div>
                            <div class="result-waiting for_free_width d-none">
                                <div class="header">
                                    <div class="result-text-download-all">
                                        <span>Result (<span class="no_of_images">3</span>)</span>
                                        <div>
                                            <button class="start-over-btn"><img src="https://www.imagetotext.info/web_assets/frontend/img/start-over-icon.svg" alt="" /> Start Over</button>
                                            <button class="download-all-btn d-none"><img src="https://www.imagetotext.info/web_assets/frontend/img/download-all-icon.svg" alt="" /> Download All</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex convert-btn-row">
                            <div class="text-center pb-1 my-3 mt-4 bg-light" style="width: 300px; max-width: 300px;">

                            </div>
                            <div class="capcha_submit_row text-center">
                                <div class="error-msg"></div>
                                <div id="jsShadowRoot" class="">
                                    <button id="generate_text_btn"><span>Submit</span></button>
                                </div>
                                <div class="reset-btn">
                                    <span>
                                        <p>Reset</p>
                                        <img src="https://www.imagetotext.info/web_assets/frontend/img/restart.svg" alt="restart" />
                                    </span>
                                </div>
                            </div>
                            <div class="text-center pb-1 my-3 mt-4 bg-light" style="width: 300px; max-width: 300px;">

                            </div>
                        </div>
                    </div>
                    <div class="result-span d-none">
                        <div class="tool-result-grid full-w">
                            <div class="tool-result">
                                <div id="result-sec">
                                    <div class="response-result js-to-copy" contenteditable="true">
                                        <p class="result-text"></p>
                                    </div>
                                    <div class="start-Over">
                                        <div class="js-start-over">Redo
                                            <img src="https://www.imagetotext.info/web_assets/frontend/img/startover-reload.svg" alt="reload">
                                        </div>
                                    </div>
                                    <div class="text-center results-btn-sec">
                                        <button class="copy-download-btn js-copy-text">Copy to Clipboard</button>
                                        <button class="copy-download-btn js-save-text" data-type="text">Download Text File 🡇</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="for_result_text d-none">﻿</div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/jquery-ui.js"></script>
    
</body>
</html>
