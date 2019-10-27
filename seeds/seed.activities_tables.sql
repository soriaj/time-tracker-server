BEGIN;

TRUNCATE activities_users, activities RESTART IDENTITY CASCADE;

INSERT INTO activities_users (user_name, full_name, password)
VALUES
   -- ('javier', 'Javier Soria', 'Password1!'),
   ('javier', 'Javier Soria', '$2a$12$OA/Ow/k5FmGchOE5A9nLReDHk4rk/MZghl72yAbyoxOCUTeOXbnWS'),
   ('user1', 'User 01', 'Password1!'),
   ('user2', 'User 02', 'Password1!');

INSERT INTO activities (summary, company, customer_name, description, author_id)
VALUES
   (
      'Activty 1',
      'eCorp',
      'Mr. Robot',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?',
      1
   ),
   (
      'Activty 2',
      'Awesome Deals',
      'Jane Doe',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.',
      2
   ),
   (
      'Activty 3',
      'Energy Inc',
      'John Doe',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.',
      3
   ),
   (
      'Activty 4',
      'eCorp',
      'Mr. Robot',
      'Bacon ipsum dolor amet doner shank beef t-bone brisket meatloaf pork loin ham hock chuck ball tip tri-tip pastrami pork chop. Buffalo venison bresaola, cow ground round brisket meatloaf tail cupim kielbasa turducken.',
      1      
   ),
   (
      'Activty 5',
      'eCorp',
      'Mr. Robot',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?',
      3
   ),
   (
      'Activty 6',
      'Energy Inc',
      'Mr. Energy',
      'Beef ribs alcatra ground round prosciutto landjaeger strip steak leberkas doner spare ribs andouille filet mignon venison ham hock ham ball tip. T-bone buffalo boudin shankle short loin picanha bacon strip steak.',
      1
   );

COMMIT;