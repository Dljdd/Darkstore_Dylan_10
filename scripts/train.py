import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric
import matplotlib.pyplot as plt
import itertools
import multiprocessing
from multiprocessing import freeze_support
import pickle

if __name__ == '__main__':
    freeze_support()
    
    # Load the data
    df = pd.read_csv('../data/biryani/generated_seasonal_data.csv')
    df['ds'] = pd.to_datetime(df['ds'])

    # Read the demand_region_wise data to get the list of regions
    demand_region_wise = pd.read_csv('../data/biryani/demand_region_wise.csv')
    regions = demand_region_wise['Location'].unique()

    # Create one-hot encoded columns for regions if not already present
    for region in regions:
        if f'region_{region}' not in df.columns:
            df[f'region_{region}'] = np.random.choice([0, 1], size=len(df), p=[0.8, 0.2])

    # Create a festival dataset
    festivals = pd.DataFrame({
        'holiday': ['Diwali', 'Holi', 'Christmas', 'Eid'],
        'ds': pd.to_datetime(['2023-11-12', '2023-03-08', '2023-12-25', '2023-04-22'])
    })

    # Add future dates for these festivals
    future_festivals = pd.DataFrame({
        'holiday': ['Diwali', 'Holi', 'Christmas', 'Eid'],
        'ds': pd.to_datetime(['2024-10-31', '2024-03-25', '2024-12-25', '2024-04-10'])
    })

    festivals = pd.concat([festivals, future_festivals])

    # Add festival information to the dataframe
    for _, row in festivals.iterrows():
        festival_name = row['holiday']
        festival_date = row['ds']
        df[festival_name] = (df['ds'] == festival_date).astype(int)

    # Split the data into training and testing sets (80-20 split)
    train_size = int(len(df) * 0.8)
    train_df = df[:train_size]
    test_df = df[train_size:]

    # Ensure we have at least 365 days of training data
    if len(train_df) < 365:
        print("Warning: Less than 365 days of training data. Adjusting split.")
        train_df = df[:365]
        test_df = df[365:]

    print(f"Training data size: {len(train_df)} days")
    print(f"Testing data size: {len(test_df)} days")

    # Initialize and fit the Prophet model with tuned parameters and festivals
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10,
        holidays_prior_scale=10
    )

    # Add region regressors
    for region in regions:
        model.add_regressor(f'region_{region}')

    # Add festival regressors
    for festival in festivals['holiday'].unique():
        model.add_regressor(festival)

    # Fit the model
    model.fit(train_df)

    # Perform hyperparameter tuning
    param_grid = {  
        'changepoint_prior_scale': [0.001, 0.01, 0.1, 0.5],
        'seasonality_prior_scale': [0.01, 0.1, 1.0, 10.0],
    }

    # Generate all combinations of parameters
    all_params = [dict(zip(param_grid.keys(), v)) for v in itertools.product(*param_grid.values())]
    rmses = []  # Store the RMSEs for each params here

    # Use cross validation to evaluate all parameters
    for params in all_params:
        m = Prophet(**params).fit(train_df)  # Fit model with given params
        df_cv = cross_validation(m, initial='365 days', period='30 days', horizon='30 days', parallel="processes")
        df_p = performance_metrics(df_cv, rolling_window=1)
        rmses.append(df_p['rmse'].values[0])

    # Find the best parameters
    tuning_results = pd.DataFrame(all_params)
    tuning_results['rmse'] = rmses
    print(tuning_results)

    best_params = all_params[np.argmin(rmses)]
    print('Best parameters:', best_params)

    # Refit the model with the best parameters
    model = Prophet(**best_params)
    for region in regions:
        model.add_regressor(f'region_{region}')
    for festival in festivals['holiday'].unique():
        model.add_regressor(festival)
    model.fit(train_df)

    # Create future dataframe
    future = model.make_future_dataframe(periods=len(test_df))

    # Add region columns to future dataframe
    for region in regions:
        future[f'region_{region}'] = df[f'region_{region}']

    # Add festival columns to future dataframe
    for festival in festivals['holiday'].unique():
        future[festival] = 0
        festival_dates = festivals[festivals['holiday'] == festival]['ds']
        future.loc[future['ds'].isin(festival_dates), festival] = 1

    # Make predictions
    forecast = model.predict(future)

    # Evaluate the model
    # Adjust cross-validation parameters
    cv_results = cross_validation(model, initial='365 days', period='30 days', horizon='30 days')
    performance = performance_metrics(cv_results)
    print("Model Performance Metrics:")
    print(performance)

    # Plot the forecast
    plt.figure(figsize=(12, 6))
    model.plot(forecast)
    plt.title('Chicken Biryani Demand Forecast')
    plt.xlabel('Date')
    plt.ylabel('Demand')
    plt.legend(['Actual', 'Forecast', 'Uncertainty Interval'])
    plt.show()

    # Plot the components of the forecast
    plt.figure(figsize=(12, 10))
    model.plot_components(forecast)
    plt.show()

    # Save the model
    model_filename = '../app/models/prophet_model.pkl'
    with open(model_filename, 'wb') as f:
        pickle.dump(model, f)

    print(f"Model saved to {model_filename}")

    # Save the forecast results
    forecast.to_csv('../data/processed/forecast_results.csv', index=False)
    print("Forecast results saved to ../data/processed/forecast_results.csv")

    # Plot cross-validation metric (MAPE)
    plt.figure(figsize=(10, 6))
    cv_results['mape'] = np.abs((cv_results['y'] - cv_results['yhat']) / cv_results['y']) * 100
    cv_results['horizon'] = pd.to_datetime(cv_results['ds']) - pd.to_datetime(cv_results['cutoff'])
    cv_results['horizon'] = cv_results['horizon'].dt.total_seconds() / (24 * 3600)
    cv_results.groupby('horizon')['mape'].mean().plot()
    plt.title('Cross-validation MAPE')
    plt.xlabel('Horizon (days)')
    plt.ylabel('MAPE (%)')
    plt.show()

    # Calculate and print MAPE on the test set
    y_true = test_df['y']
    y_pred = forecast.tail(len(test_df))['yhat']
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    print(f"MAPE on test set: {mape:.2f}%")

    # Plot actual vs predicted values for the test set
    plt.figure(figsize=(12, 6))
    plt.plot(test_df['ds'], test_df['y'], label='Actual')
    plt.plot(test_df['ds'], y_pred, label='Predicted')
    plt.title('Actual vs Predicted Chicken Biryani Demand (Test Set)')
    plt.xlabel('Date')
    plt.ylabel('Demand')
    plt.legend()
    plt.show()
