from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Simulated user authentication (username, password)
users = {"rashib zahoor": "password123", "amir afzal": "password123"}

# Simulated bank account data
bank_accounts = {
    "8825047306": {"account_holder": "rashib zahoor", "balance": 1000, "account_type": "Savings", "transactions": []},
    "6005812681": {"account_holder": "amir afzal", "balance": 2500, "account_type": "Checking", "transactions": []}
}

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if users.get(username) == password:
            return render_template('home.html', username=username)
        else:
            return render_template('login.html', message="Invalid credentials")
    return render_template('login.html')

# View Account Summary
@app.route('/account_summary/<account_number>')
def account_summary(account_number):
    account_info = bank_accounts.get(account_number)
    if account_info:
        return render_template('account_summary.html', account_info=account_info)
    else:
        return render_template('error.html', message="Account not found!")

# Update balance (Deposit)
@app.route('/update_balance', methods=['GET', 'POST'])
def update_balance():
    if request.method == 'POST':
        account_number = request.form['account_number']
        new_balance = float(request.form['new_balance'])
        account_info = bank_accounts.get(account_number)
        if account_info:
            account_info['balance'] = new_balance
            account_info['transactions'].append(f"Balance updated to ${new_balance}")
            return render_template('result.html', account_info=account_info)
        else:
            return render_template('error.html', message="Account not found!")
    return render_template('update_balance.html')

# View Transaction History
@app.route('/transactions/<account_number>')
def view_transactions(account_number):
    account_info = bank_accounts.get(account_number)
    if account_info:
        return render_template('transactions.html', transactions=account_info['transactions'])
    else:
        return render_template('error.html', message="Account not found!")

# Transfer Money (Send Money)
@app.route('/transfer', methods=['GET', 'POST'])
def transfer():
    if request.method == 'POST':
        sender_account = request.form['sender_account']
        receiver_account = request.form['receiver_account']
        amount = float(request.form['amount'])  # Convert amount to float for processing

        sender_info = bank_accounts.get(sender_account)
        receiver_info = bank_accounts.get(receiver_account)

        # Check if both accounts exist and sender has sufficient balance
        if sender_info and receiver_info and sender_info['balance'] >= amount:
            sender_info['balance'] -= amount  # Deduct amount from sender's balance
            receiver_info['balance'] += amount  # Add amount to receiver's balance

            # Record the transaction for both sender and receiver
            sender_info['transactions'].append(f"Transferred ${amount} to {receiver_account}")
            receiver_info['transactions'].append(f"Received ${amount} from {sender_account}")

            # Return a success message or updated information
            return render_template('result.html', account_info=sender_info)
        else:
            # If the sender doesn't have enough balance or accounts are invalid
            return render_template('error.html', message="Insufficient funds or invalid account")
    
    # If it's a GET request, render the transfer form
    return render_template('transfer_form.html')


# Generate Account Statement
@app.route('/generate_statement/<account_number>')
def generate_statement(account_number):
    account_info = bank_accounts.get(account_number)
    if account_info:
        transactions = account_info['transactions']
        statement = "\n".join([f"Transaction: {transaction}" for transaction in transactions])
        return render_template('statement.html', statement=statement)
    else:
        return render_template('error.html', message="Account not found!")

# Logout Route
@app.route('/logout')
def logout():
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)
