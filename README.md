# Documenter Codewars Challenges

An easy way to document your Codewars challenges, organize them by language, and keep everything structured!

## Features:
- Automatically fetches challenge descriptions and metadata directly from the codewars website.
- Creates individual folders for each challenge.
- Generates a `README.md` for each challenge with details such as title, difficulty, description, and sample tests.
- Organizes challenges by programming language.
- Creates a main `README.md` listing all solved challenges categorized by language and difficulty.
- Supports documenting challenges from Codewars custom list.

## Setup:
1. Clone the repository.
2. Run the following command to install dependencies:

   ```bash
   npm i
   ```
3. Create a ```.env``` file based on ```.env.example```. Here's an example of the .env content:

```
# Target destination
PROJECT_DIR_PATH=/home/username/directory

# Remote repository (Ex: GitHub)
REPOSITORY_URL=https://github.com/{username}/{repositoriy_name}/tree/{branch_name}

# Challenges list from Codewars
CHALLENGES_LIST_URL=https://www.codewars.com/kata/search/sql?q=&xids=not_completed&order_by=sort_date%20desc

# YOUR CODEWARS PROFILE
CODEWARS_PROFILE=https://www.codewars.com/users/{your_username}

```
<br>
4. Edit the .env file with the appropriate values.

## Running the Script:
1. Once everything is set up, run the script with the following command:

   ```bash
   node .
   ```

2. The script will:

- Fetch the challenge list from the `CHALLENGES_LIST_URL`.
- Create folders for each challenge.
- Generate a detailed `README.md` file for each challenge.
- Update the main `README.md` with an organized list of challenges.

## Folder Structure:
The script will create a folder structure in the target directory like the following:

```
project-dir/
|-- code-language/
|   |-- difficulty/
|       |-- challenge1/
|           |-- README.md
|           |-- solution.ext
|       |-- challenge2/
|           |-- README.md
|           |-- solution.ext
|       ...
|    ...
|-- main-README.md
```
Each challenge folder will contain:

- The challenge's `README.md` with its title, difficulty, description, and solution.
- The solution file.

The main `README.md` will include:

- A list of all documented challenges.
- Categorization by programming language.

### Hint: How to get a list of challenges in Codewars?<br><br>

- **_Example_:** **Language:** _SQL_ | **Difficulty:** _8kyu_ | **Progress:** _Kata I have completed_ | Status: _Approved & Beta_

<img src='./img/get_codewars_challenges_link_list.png'></img>
