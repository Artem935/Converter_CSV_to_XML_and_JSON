using Microsoft.Win32;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Windows;
using System.Xml.Linq;

namespace Systemy
{
    public partial class MainWindow : Window
    {
        string _csvFilePath; // temp file path
        string _jsonFilePath;
        string _xmlFilePath;
        private readonly object _jsonLock = new object(); //avoid rewrite each other documents
        private readonly object _xmlLock = new object(); 
        public MainWindow()
        {
            InitializeComponent();
        }
        private void OnFileDrop(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                _csvFilePath = files[0];
                if (Path.GetExtension(_csvFilePath).ToLower() == ".csv")
                {
                    ConvertCsvFile();
                }
                else
                {
                    MessageBox.Show("Take only CSV type.", "Wrong file type", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private async void ConvertCsvFile()
        {
            DownloadButton.IsEnabled = false;
            ProgressBar.Visibility = Visibility.Visible;
            ProgressBar.Value = 0; // procent bar

            var syncJsonTime = MeasureTime(ConvertCsvToJsonSync);
            ProgressBar.Value = 25;
            var syncXmlTime = MeasureTime(ConvertCsvToXmlSync);
            ProgressBar.Value = 50;

            var asyncJsonTime = await MeasureTimeAsync(ConvertCsvToJsonAsync);
            ProgressBar.Value = 75;
            var asyncXmlTime = await MeasureTimeAsync(ConvertCsvToXmlAsync);
            ProgressBar.Value = 100;

            ResultsTextBlock.Text = $"Sync JSON:\t{syncJsonTime.TotalSeconds * 100} ms\n" +
                                    $"Async JSON:\t{asyncJsonTime.TotalSeconds * 100} ms\n" +
                                    $"Sync XML:\t{syncXmlTime.TotalSeconds * 100} ms\n" +
                                    $"Async XML:\t{asyncXmlTime.TotalSeconds * 100} ms";

            ProgressBar.Visibility = Visibility.Collapsed;
            DownloadButton.IsEnabled = true;
        }
        private void ConvertCsvToJsonSync()
        {
            ConvertCsvToJson(_csvFilePath);
        }
        private void ConvertCsvToXmlSync()
        {
            ConvertCsvToXml(_csvFilePath);
        }
        private async Task ConvertCsvToJsonAsync()
        {
            var csvLines = File.ReadAllLines(_csvFilePath);
            var headers = csvLines[0].Split(',');
            var half = csvLines.Length / 2;
            var jsonArray = new Newtonsoft.Json.Linq.JArray();
            var task1 = Task.Run(() => ConvertPartToJson(csvLines, headers, 1, half, jsonArray)); // paralel thread 1
            var task2 = Task.Run(() => ConvertPartToJson(csvLines, headers, half + 1, csvLines.Length, jsonArray)); //2
            // ждем конца работы асинхрона
            await Task.WhenAll(task1, task2);
            _jsonFilePath = Path.ChangeExtension(_csvFilePath, ".json");
            File.WriteAllText(_jsonFilePath, JsonConvert.SerializeObject(jsonArray, Newtonsoft.Json.Formatting.Indented));
        }
        private async Task ConvertCsvToXmlAsync()
        {
            var csvLines = File.ReadAllLines(_csvFilePath);
            var headers = csvLines[0].Split(',');
            var half = csvLines.Length / 2;
            var xmlDoc = new XElement("Root");
            var task1 = Task.Run(() => ConvertPartToXml(csvLines, headers, 1, half, xmlDoc)); // paralel thread 1
            var task2 = Task.Run(() => ConvertPartToXml(csvLines, headers, half + 1, csvLines.Length, xmlDoc)); //2
            // ждем конца работы асинхрона
            await Task.WhenAll(task1, task2);
            _xmlFilePath = Path.ChangeExtension(_csvFilePath, ".xml");
            File.WriteAllText(_xmlFilePath, xmlDoc.ToString());
        }
        private void ConvertPartToJson(string[] csvLines, string[] headers, int start, int end, Newtonsoft.Json.Linq.JArray jsonArray)
        {
            for (int i = start; i < end; i++)
            {
                var values = csvLines[i].Split(',');
                var jsonObject = new Newtonsoft.Json.Linq.JObject();
                for (int j = 0; j < headers.Length; j++)
                {
                    jsonObject[headers[j]] = values[j];
                }
                lock (_jsonLock)
                {
                    jsonArray.Add(jsonObject);
                }
            }
        }
        private void ConvertPartToXml(string[] csvLines, string[] headers, int start, int end, XElement xmlDoc)
        {
            for (int i = start; i < end; i++)
            {
                var values = csvLines[i].Split(',');
                var xmlElement = new XElement("Row");
                for (int j = 0; j < headers.Length; j++)
                {
                    xmlElement.Add(new XElement(headers[j], values[j]));
                }

                lock (_xmlLock)
                {
                    xmlDoc.Add(xmlElement);
                }
            }
        }
        private void ConvertCsvToJson(string csvFilePath)
        {
            var csvLines = File.ReadAllLines(csvFilePath);
            var headers = csvLines[0].Split(',');
            var jsonArray = new Newtonsoft.Json.Linq.JArray();
            for (int i = 1; i < csvLines.Length; i++)
            {
                var values = csvLines[i].Split(',');
                var jsonObject = new Newtonsoft.Json.Linq.JObject();
                for (int j = 0; j < headers.Length; j++)
                {
                    jsonObject[headers[j]] = values[j];
                }
                jsonArray.Add(jsonObject);
            }
            _jsonFilePath = Path.ChangeExtension(csvFilePath, ".json");
            File.WriteAllText(_jsonFilePath, JsonConvert.SerializeObject(jsonArray, Newtonsoft.Json.Formatting.Indented));
        }
        private void ConvertCsvToXml(string csvFilePath)
        {
            var csvLines = File.ReadAllLines(csvFilePath);
            var headers = csvLines[0].Split(',');
            var xmlDoc = new XElement("Root");
            for (int i = 1; i < csvLines.Length; i++)
            {
                var values = csvLines[i].Split(',');
                var xmlElement = new XElement("Row");
                for (int j = 0; j < headers.Length; j++)
                    xmlElement.Add(new XElement(headers[j], values[j]));

                xmlDoc.Add(xmlElement);
            }
            _xmlFilePath = Path.ChangeExtension(csvFilePath, ".xml");
            File.WriteAllText(_xmlFilePath, xmlDoc.ToString());
        }
        private TimeSpan MeasureTime(Action action)
        {
            var stopwatch = Stopwatch.StartNew();
            action();
            stopwatch.Stop();
            return stopwatch.Elapsed;
        }
        private async Task<TimeSpan> MeasureTimeAsync(Func<Task> func)
        {
            var stopwatch = Stopwatch.StartNew();
            await func();
            stopwatch.Stop();
            return stopwatch.Elapsed;
        }
        private void DownloadButton_Click(object sender, RoutedEventArgs e)
        {
            SaveFile(_jsonFilePath);
            SaveFile(_xmlFilePath);
        }
        private void SaveFile(string filePath)
        {
            var saveFileDialog = new SaveFileDialog
            {
                FileName = Path.GetFileName(filePath),
                Filter = "All files (*.*)|*.*",
                InitialDirectory = Path.GetDirectoryName(filePath)
            };
            if (saveFileDialog.ShowDialog() == true)
                File.Copy(filePath, saveFileDialog.FileName, overwrite: true);

        }
    }
}
