# CSV to JSON and XML Converter

## Description

This project is a WPF application in C# that accepts a CSV file and converts it to JSON and XML formats. The conversion can be performed both synchronously and asynchronously, with the ability to display the execution time for both methods. The application also supports a progress bar to show the current state of the conversion process.

## Features

- Accepts CSV files via drag-and-drop into the application window.
- Converts CSV to JSON and XML.
- Measures execution time for both synchronous and asynchronous methods.
- Displays conversion progress using a progress bar.
- Allows downloading the converted JSON and XML files.

## Requirements

- .NET Framework 4.7.2 or higher
- Newtonsoft.Json library

## Installation

1. Open the project in Visual Studio(Click to System.sln in main directiry).
2. Install the necessary NuGet packages:

    - Newtonsoft.Json
    - 
## Run application
1. Open main directory
2. 

## Usage

1. Run the application from Visual Studio.
2. Drag and drop a CSV file into the drop area at the top of the window.
3. The application will automatically start the conversion process and display the progress on the progress bar.
4. After the conversion is complete, the application will show the execution time for both synchronous and asynchronous methods.
5. Click the "Download XML and JSON" button to download the converted files.

## Project Structure

- `MainWindow.xaml` - The user interface layout file.
- `MainWindow.xaml.cs` - The main application code, handling file drop, conversion, and displaying results.
