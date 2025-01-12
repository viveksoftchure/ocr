<?php
require 'lib/TesseractOCR/vendor/autoload.php'; // Include Composer's autoloader
require 'lib/Stichoza/vendor/autoload.php'; // Include Composer's autoloader

use thiagoalessio\TesseractOCR\TesseractOCR;
use Stichoza\GoogleTranslate\GoogleTranslate;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["base64Image"])) {
    $base64Image = $_POST["base64Image"];
    $imgname = isset($_POST["imgname"]) ? $_POST["imgname"] : '';
    $count = isset($_POST["count"]) ? $_POST["count"] : '';
    $language = isset($_POST["language"]) ? $_POST["language"] : 'hi';
    
    try {
        // Decode the base64 image
        // $imageData = base64_decode($base64Image);

        // Define the directory where you want to save the image
        $imageDirectory = 'uploads/';
        if (!file_exists($imageDirectory)) {
            mkdir($imageDirectory, 0755, true);
        }

        // Generate a unique filename for the image
        $uniqueFilename = uniqid() . '.jpg'; // Assuming it's a PNG image
        $imagePath = $imageDirectory . $uniqueFilename;

        // Save the decoded image to the directory
        // file_put_contents($imagePath, $imageData);
        file_put_contents($imagePath, file_get_contents($base64Image));

        // Set the TESSDATA_PREFIX environment variable
        putenv('TESSDATA_PREFIX=C:\Program Files\Tesseract-OCR\tessdata');

        // Perform OCR using Tesseract
        $ocrResult = (new TesseractOCR($imagePath))->run();

        // Translate using Google Translate PHP library
        $translator = new GoogleTranslate();
        $translation = $translator->setSource()->setTarget($language)->translate($ocrResult);


        // Display the OCR result
        echo json_encode(["error" => false, "text" => $translation, "count" => $count, "imgname" => $imgname]);
        exit;
    } catch (Exception $e) {
        echo json_encode(["error" => true, "text" => $e->getMessage(), "count" => $count, "imgname" => $imgname]);
        exit;
    }
}
?>