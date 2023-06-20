# Form Validation

## Requirements

1. First validations should occur only on the first submit try
2. Following validations occur onChange

## Field Example

```js
<FormField
  label="Name"
  type="text"
  name="name"
  value={form.name || ""}
  onChange={handleChange}
  error={errors.name}
/>
```

## Custom hook

```js
const { form, errors, handleChange, validateForm, isFormValid, hasErrors } =
  useForm(useFormParameters);
```

- useFormParameters

  - ```js
        {
        initialFormState: registerFormFields,
        validationRules: registerFormRules,
        };
      ```

    - initialFormState (represents the default form state)

      - ```js
          export const registerFormFields = {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
           };  
        ```

    - validationRules (represents the validation to which each field will be submitted. Returns string if error and undefined otherwise)

      - ```js
          export type ValidationRules = {
              [key: string]: (value: string, password?: string) => string | undefined;
          };
        ```

      - ```js
          export const registerFormRules: ValidationRules = {
              name: validateUsername,
              email: validateEmail,
              password: validatePassword,
              confirmPassword: validatePasswordEquality,
            };
        ```

        - Example:

          - ```js
              export const validateUsername = (value: string) => {
              const isValid = value.length > 3;
              if (!isValid) return "Invalid username";
              return undefined;
              }
            ```

- validation logic:

  - ```js
      const validateForm = (): ErrorState => {
        const errorObj: ErrorState = { ...defaultErrorState };

        for (const field in form) {
          const validationMethod = validationRules[field];

          const errorObjKey = field as keyof ErrorState;
          const formObjKey = field as keyof FormState;

          if (field === "confirmPassword") {
            errorObj[errorObjKey] = validationMethod(
              form[formObjKey] || "",
              form.password || ""
            );
          } else {
            errorObj[errorObjKey] = validationMethod(form[formObjKey] || "");
          }
        }

        handleValidationErrors(errorObj);
        setHasTriedSubmission(true);
        return errorObj;
      };
    ```
