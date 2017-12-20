import sys
import json
import os
import requests

def parse_data(filename):
    try:
        with open(filename, 'r') as json_file:
            json_data = json.load(json_file)
    except Exception as e:
        print("Error: can not load data")
        print(e)
        sys.exit()

    print(len(json_data), "recordings found.")
    return json_data

def generate_filename(no, time):
    time_s = time.split(" ")
    return "{}_{}_{}.m4v".format(no, time_s[0],time_s[1])

def download_file(url, filename):
    with open(filename, "wb") as f:
        print("Downloading {}".format(filename))
        response = requests.get(url, stream=True)
        total_length = response.headers.get('content-length')

        if total_length is None: # no content length header
            f.write(response.content)
        else:
            dl = 0
            total_length = int(total_length)
            for data in response.iter_content(chunk_size=4096):
                dl += len(data)
                f.write(data)
                done = int(50 * dl / total_length)
                sys.stdout.write("\r[%s%s]" % ('=' * done, ' ' * (50-done)) )
                sys.stdout.flush()


def download_rec(filename, savefolder):
    data = parse_data(filename)

    print("------------------------")

    if not os.path.exists(savefolder):
        os.makedirs(savefolder)

    no = 1
    for row in data:
        filename = generate_filename(str(no).zfill(2), row['time'])
        filename = os.path.join(savefolder, filename)
        no += 1

        download_file(row['url'], filename)
        print();



    print("finished!")




if len(sys.argv)<3:
    print("Usage:")
    print("\t python3 Downloader.py path/to/data.json path/to/download/directory/");
else:
    download_rec(sys.argv[1], sys.argv[2])
