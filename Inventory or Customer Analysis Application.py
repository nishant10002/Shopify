import mysql.connector

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

def inventory_analysis(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT ProductID, Name, Price, QuantityInStock FROM Product WHERE QuantityInStock < 50")
        low_stock_products = cursor.fetchall()
        print("Products with low stock(less than 50): ")
        for product in low_stock_products:
            print("ProductID:", product[0], "| Name:", product[1], "| Price:", product[2], "| Quantity In Stock:", product[3])
        cursor.close()
    except mysql.connector.Error as err:
        print("Error performing inventory analysis:", err)

def customer_analysis(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT UserID, SUM(TotalAmount) AS TotalSpent FROM Orders GROUP BY UserID ORDER BY TotalSpent DESC LIMIT 5")
        top_customers = cursor.fetchall()
        print("Top 5 Customers based on total spent amount: ")
        for customer in top_customers:
            print("UserID:",customer[0], "| Spending:",customer[1])
        cursor.close()
    except mysql.connector.Error as err:
        print("Error performing customer analysis:", err)

def main():
    conn = connect_to_database()
    print("Welcome to Inventory and Customer Analysis Application !")
    # Admin login
    while True:
        admin_username = input("Enter admin username: ")
        admin_password = input("Enter admin password: ")

        if admin_username == 'admin' and admin_password == 'admin@123':
            print("Admin login successful!\n")
            break
        else:
            print("Invalid admin credentials. Please try again.\n")

    # Main Menu
    while True:
        print("1. Perform Inventory Analysis")
        print("2. Perform Customer Analysis")
        print("3. Exit")
        choice = int(input("Enter your choice: "))

        if choice == 1:
            inventory_analysis(conn)
            print()
        elif choice == 2:
            customer_analysis(conn)
            print()
        elif choice == 3:
            print()
            break
        else:
            print("Invalid choice")
            print()
    print("Thank you for using interface")
    conn.close()

if __name__ == "__main__":
    main()

