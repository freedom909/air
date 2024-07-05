import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
console.log('NEO4J_URI:', process.env.NEO4J_URI);
console.log('NEO4J_USERNAME:', process.env.NEO4J_USERNAME);
console.log('NEO4J_PASSWORD:', process.env.NEO4J_PASSWORD);
// Use the connection string provided by Neo4j Aura
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);
  
  
  async function generateInviteCode(userId) {
    const session = driver.session();
    const inviteCode = generateUniqueCode(); // Assuming this is a function you have defined
  
    try {
      await session.run(
        `CREATE (ic:InviteCode { code: $inviteCode, userId: $userId, expiresAt: datetime() + duration('P1D') })`,
        { inviteCode, userId }
      );
      return inviteCode;
    } catch (error) {
      console.error('Error generating invite code:', error);
    } finally {
      await session.close();
    }
  }
  
  function generateUniqueCode() {
    return uuidv4();
  }

  // Use the function
  generateInviteCode('667fc020d1cb0f48487da6f7').then(inviteCode => {
    console.log('Generated invite code:', inviteCode);
  }).catch(error => {
    console.error('Error:', error);
  });

  export default generateInviteCode;
 // generateInviteCode('667fc020d1cb0f48487da6f7')
  // "inviteCode":"092c7a23-77f1-4881-8955-f7a963662625",  