#!/bin/bash

if ! command -v node &> /dev/null; then
    while true; do
        read -p "Do you want to install Node.js (y/n): " installnode
        if [[ "$installnode" == "y" ]]; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
            [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
            nvm install 18
            nvm use 18
        elif [[ "$installnode" == "n" ]]; then
            exit 1
        else
            echo "Only write y or n"
        fi
    done
fi

createEnvs() {
    echo "== WEB SERVER CONFIGURATION =="

    read -p "Server port (default 3001): " serverport
    serverport=${serverport:-3001}

    read -p "Time between pictures (default 5): " timepics
    timepics=${timepics:-5}

    while [[ "$dbservice" != "local" && "$dbservice" != "turso" ]]; do
        read -p "Choose the sqlite service (local or turso): " dbservice

        if [[ "$dbservice" != "local" && "$dbservice" != "turso" ]]; then
            echo "Invalid sqlite service. Please enter 'local' or 'turso'."
        fi
    done

    if [[ "$dbservice" == 'turso' ]]; then
        while [[ -z "$tursodburl" ]]; do
            read -p "Enter the turso database url: " tursodburl
            
            if [[ -z "$tursodburl" ]]; then
                echo "Turso database url is required!"
            fi
        done

        while [[ -z "$tursoauthtoken" ]]; do
            read -p "Enter the turso auth token: " tursoauthtoken
            
            if [[ -z "$tursoauthtoken" ]]; then
                echo "Turso auth token is required!"
            fi
        done

        while [[ -z "$tursorole" ]]; do
            read -p "Enter the turso auth role: " tursorole
            
            if [[ -z "$tursorole" ]]; then
                echo "Turso auth role is required!"
            fi
        done
    fi

    if [[ -f ./dashboard/.env ]]; then
        read -p "./dashboard/.env file already exists. Do you want to overwrite it? (y/n): " overwriteDashboard
        if [[ "$overwriteDashboard" == "y" ]]; then
            cat <<EOF > ./dashboard/.env
VITE_API_SERVER=http://127.0.0.1:$serverport
VITE_TIME_PICTURE=$timepics
EOF
        fi
    else
        cat <<EOF > ./dashboard/.env
VITE_API_SERVER=http://127.0.0.1:$serverport
VITE_TIME_PICTURE=$timepics
EOF

    fi

    if [[ -f ./server/.env ]]; then
        read -p "./server/.env file already exists. Do you want to overwrite it? (y/n): " overwriteServer
        if [[ "$overwriteServer" == "y" ]]; then
            cat <<EOF > ./server/.env
SERVER_PORT=$serverport
DB_SERVICE=$dbservice
EOF
            if [[ "$dbservice" == 'turso' ]]; then
                echo "TURSO_DATABASE_URL=$tursodburl" >> ./server/.env
                echo "TURSO_AUTH_TOKEN=$tursoauthtoken" >> ./server/.env
                echo "TURSO_ROLE_ACCESS=$tursorole" >> ./server/.env
            fi
        fi
    else
        cat <<EOF > ./server/.env
SERVER_PORT=$serverport
DB_SERVICE=$dbservice
EOF
        if [[ "$dbservice" == 'turso' ]]; then
            echo "TURSO_DATABASE_URL=$tursodburl" >> ./server/.env
            echo "TURSO_AUTH_TOKEN=$tursoauthtoken" >> ./server/.env
            echo "TURSO_ROLE_ACCESS=$tursorole" >> ./server/.env
        fi
    fi

    echo "Configuration files created successfully!!"
}

createEnvs

if ! dpkg -s python3-venv >/dev/null 2>&1; then
    echo "Installing python3-venv"
    sudo apt-get install -y python3-venv
else
    echo "python3-venv already installed"
fi

echo "Creating python virtual environment"
python -m venv lauenv

echo "Installing python dependencies"
lauenv/bin/pip install -r ./requirements.txt
pm2 start main

echo "Installing web app dependencies"
cd ./dashboard && npm install 

echo "Building web app for production"
npm run build

cd ..
mv ./dashboard/dist ./server

echo "Installing server dependencies"
cd ./server && npm install

echo "Installing daemon manager"
sudo npm install pm2@latest -g

echo "Launching the services"
cd ..
# pm2 start ecosystem.config.json

echo "Configuring pm2 to start at boot"
pm2 startup systemd -u $USER --hp $HOME
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi

echo "Saving pm2 process list"
pm2 save

echo "Initialization successfull"
