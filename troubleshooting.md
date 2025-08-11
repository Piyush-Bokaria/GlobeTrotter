# Troubleshooting Environment Variables

If you are facing issues with sending emails or OTPs, it is likely that your environment variables are not configured correctly. Follow these steps to troubleshoot the problem:

1.  **Create a `.env` file:** Ensure you have a `.env` file in the root of your `GlobeTrotter` project.

2.  **Add `EMAIL` and `EMAIL_PASSWORD`:** Open the `.env` file and add the following lines, replacing the placeholders with your actual Gmail credentials:

    ```
    EMAIL=your-email@gmail.com
    EMAIL_PASSWORD=your-gmail-app-password
    ```

3.  **Use a Gmail App Password:** For security reasons, it is recommended to use a Gmail App Password instead of your regular password. You can generate one by following Google's official documentation.

4.  **Install `dotenv`:** Make sure you have the `dotenv` package installed. If not, run the following command:

    ```
    npm install dotenv
    ```

5.  **Load Environment Variables:** Add the following line to the top of your `server.js` file to load the environment variables:

    ```javascript
    require('dotenv').config();
    ```

By following these steps, you should be able to resolve the issue.