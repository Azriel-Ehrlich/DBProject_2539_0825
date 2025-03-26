from sqlalchemy import create_engine, text
import pandas as pd

# connect to the database
DATABASE_URI = 'postgresql://azriel:A227Y8751@localhost:5432/mydatabase'
engine = create_engine(DATABASE_URI)
# read the csv file
df_classes = pd.read_csv('payments.csv')
# convert the column names to lowercase because postgresql automatically converts column names to lowercase
df_classes.columns = df_classes.columns.str.lower()

# insert the data into the database
df_classes.to_sql('payments', engine, if_exists='append', index=False)
