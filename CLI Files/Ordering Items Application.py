import mysql.connector
import random

def connect_to_database():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Password",
            database="shopify"
        )
        return conn
    except mysql.connector.Error as err:
        print("Error connecting to the database:", err)
        return None

def place_order(customer_id, product_id, quantity, conn):
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT QuantityInStock FROM Product WHERE ProductID = %s", (product_id,))
        available_quantity = cursor.fetchone()[0]
        
        if available_quantity >= quantity:
            new_quantity = available_quantity - quantity
            cursor.execute("UPDATE Product SET QuantityInStock = %s WHERE ProductID = %s", (new_quantity, product_id))
            
            cursor.execute("SELECT Price FROM Product WHERE ProductID = %s", (product_id,))
            price = cursor.fetchone()[0]
            cost = price * quantity
            
            de_id = random.randint(1, 10)
            cursor.execute("INSERT INTO Orders (OrderDate, Status, TotalAmount, UserID, DeliveryExecutiveID) VALUES ('2024-03-22','Processing',%s, %s, %s)", (cost,customer_id,de_id))
            print("Order placed successfully!")
        else:
            print("Insufficient quantity in stock!")
    
        conn.commit()
        cursor.close()
    except mysql.connector.Error as err:
        print("Error placing order:", err)

def main():
    conn = connect_to_database()
    if not conn:
        return

    print("Welcome to the Ordering Items Application!")

    # User login or signup
    while True:
        print("1. Login")
        print("2. Signup")
        print("3. Exit")
        login_choice = input("Enter your choice: ")

        if login_choice == '1':
            # User login
            while True:
                mobile_number = input("Enter your mobile number: ")
                password = input("Enter your password: ")

                cursor = conn.cursor()
                cursor.execute("SELECT UserID FROM User WHERE MobileNo = %s AND Password = %s", (mobile_number, password))
                user = cursor.fetchone()

                if user:
                    print("Login successful!")
                    customer_id = user[0]
                    break
                else:
                    print("Invalid mobile number or password. Please try again.")

                cursor.close()

            break

        elif login_choice == '2':
            # User signup
            while True:
                first_name = input("Enter your first name: ")
                last_name = input("Enter your last name: ")
                email = input("Enter your e-mail id: ")
                mobile_number = input("Enter your mobile number: ")
                password = input("Enter your password: ")

                cursor = conn.cursor()
                cursor.execute("INSERT INTO User (FirstName, LastName, EmailID, MobileNo, Password) VALUES (%s, %s, %s, %s, %s)", (first_name, last_name, email, mobile_number, password))
                conn.commit()
                cursor.close()

                print("Signup successful!")
                break

            continue

        elif login_choice == '3':
            print("Thank you for using the Ordering Items Application!")
            break

        else:
            print("Invalid choice. Please try again.")

    # Main menu
    while True:
        print("1. Order Items")
        print("2. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            # Display available products
            print("\nAvailable Products:")
            cursor = conn.cursor()
            cursor.execute("SELECT ProductID, Name, Price, QuantityInStock FROM Product")
            products = cursor.fetchall()
            for product in products:
                print("ProductID:", product[0], "| Name:", product[1], "| Price:", product[2], "| Quantity In Stock:", product[3])
            cursor.close()
            product_id = int(input("Enter the product ID you want to order: "))
            quantity = int(input("Enter the quantity: "))

            place_order(customer_id, product_id, quantity, conn)
            print()

        elif choice == '2':
            print("Thank you for using the Ordering Items Application!")
            break

        else:
            print("Invalid choice. Please try again.")

    conn.close()

if __name__ == "__main__":
    main()
