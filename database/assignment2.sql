-- Insert new record into account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Modify account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delete Tony Stark record from database
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify "GM Hummer" to "a huge interior"
UPDATE public.inventory
SET inv_description= REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM'

--Use inner join
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

--Update all records to add "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');