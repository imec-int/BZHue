// eventlogger.cpp : Defines the entry point for the DLL application.
//

#include "bzfsAPI.h"
#include <stdio.h>
// event handler callback
#include "cURLManager.h"




class EventPoster : cURLManager {
public:
  EventPoster();
  void addKeyValuePair(const char *key, const char *value);
  void postStuff();
  virtual void finalization(char *data, unsigned int length, bool good);
  static int requestCounter;
};

EventPoster::EventPoster() : cURLManager(){
  setURL("http://10.0.1.5:3000/bzflag");
}

void EventPoster::addKeyValuePair(const char *key, const char *value)
{
  addFormData(key, value);
}

void EventPoster::postStuff(){
  setHTTPPostMode();
  requestCounter++;
  addHandle();
}

int EventPoster::requestCounter = 0;

void EventPoster::finalization(char *data, unsigned int length, bool good)
{
  requestCounter--;
}

class EventLogger : public bz_Plugin
{
public:
  virtual ~EventLogger(){};
  virtual const char* Name () {return "EventLogger";}
  virtual void Init ( const char* c);
  virtual void Cleanup ( void );
  virtual void Event ( bz_EventData *eventData );
};

static std::vector<EventPoster*> epVector;

BZ_PLUGIN(EventLogger)

void EventLogger::Event(bz_EventData *eventData)
{
  switch (eventData->eventType) {

  default: {
    // no, sir, we didn't ask for THIS!!
    bz_debugMessage(1, "customflagsample: received event with unrequested eventType!");
    return;
  }

  case bz_eFlagGrabbedEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_FlagGrabbedEventData_V1* fge = (bz_FlagGrabbedEventData_V1*)eventData;
    int p = fge->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    // sprintf(buf, "player id %d, flag id %d", fge->playerID, fge->flagID);
    // bz_debugMessage(1, buf);
    evPoster->addKeyValuePair("action", "flaggrabbed");
    evPoster->addKeyValuePair("player", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("flag", fge->flagType);
    evPoster->postStuff();

    // bz_sendTextMessage(BZ_SERVER, BZ_ALLUSERS, "laffen teek!!!");
    break;
  }

  case bz_eFlagDroppedEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_FlagDroppedEventData_V1* fde = (bz_FlagDroppedEventData_V1*)eventData;
    int p = fde->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    evPoster->addKeyValuePair("action", "flagdropped");
    evPoster->addKeyValuePair("player", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("flag", fde->flagType);
    evPoster->postStuff();

    break;
  }

  case bz_eShotFiredEvent: {
    char buf[8];
    sprintf(buf, "rc %d", EventPoster::requestCounter);
    bz_debugMessage(1, buf);
    if(EventPoster::requestCounter==0){
      int  texNo = epVector.size();
      char vs[8];
      sprintf(vs, "vs %d", texNo);
      bz_debugMessage(1, vs);
      for (int i = 0; i < texNo; i++)
        delete epVector[i];
        epVector.clear();
    }
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_ShotFiredEventData_V1* sfed = (bz_ShotFiredEventData_V1*)eventData;
    int p = sfed->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    // this user must be cool, add 10 to their score
    evPoster->addKeyValuePair("action", "shotfired");
    evPoster->addKeyValuePair("player", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("flag", sfed->type.c_str());
    evPoster->postStuff();
    // if(playerRecord->callsign.c_str()[0] == 'm'){
    //   bz_setPlayerWins(p, playerRecord->wins+50);
    //    bz_debugMessage(1, "matthias shoots");
    // }
    break;
  }

  case bz_ePlayerDieEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_PlayerDieEventData_V1* deed = (bz_PlayerDieEventData_V1*)eventData;
    bz_ApiString flag = deed->flagKilledWith;
    int p = deed->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    int k = deed->killerID;
    bz_BasePlayerRecord *playerRecord2 = bz_getPlayerByIndex(k);
    if(!playerRecord2) break;
    evPoster->addKeyValuePair("action", "kill");
    evPoster->addKeyValuePair("player", playerRecord2->callsign.c_str());
    evPoster->addKeyValuePair("victim", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("flag", flag.c_str());
    evPoster->postStuff();

    break;
  }

  case bz_eGameEndEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    evPoster->addKeyValuePair("action", "gameend");
    evPoster->postStuff();

    break;
  }

  case bz_eGameStartEvent: {
    EventPoster*  evPoster = new EventPoster();
    epVector.push_back(evPoster);
    evPoster->addKeyValuePair("action", "gamestart");
    evPoster->postStuff();
  }

  case bz_eGetPlayerInfoEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_GetPlayerInfoEventData_V1* pie = (bz_GetPlayerInfoEventData_V1*)eventData;
    char team[7];
    evPoster->addKeyValuePair("action", "playerinfo");
    evPoster->addKeyValuePair("player", pie->callsign.c_str());
    if(pie->team == eRabbitTeam)
      strcpy(team, "rabbit");
    if(pie->team == eHunterTeam)
      strcpy(team, "hunter");
    evPoster->addKeyValuePair("team", team);
    evPoster->postStuff();

    break;

  }

  case bz_ePlayerJoinEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_PlayerJoinPartEventData_V1* pje = (bz_PlayerJoinPartEventData_V1*)eventData;
    bz_BasePlayerRecord *playerRecord = pje->record;
    evPoster->addKeyValuePair("action", "join");
    evPoster->addKeyValuePair("player",  playerRecord->callsign.c_str());
    evPoster->postStuff();

    break;
  }

  case bz_ePlayerPartEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_PlayerJoinPartEventData_V1* pje = (bz_PlayerJoinPartEventData_V1*)eventData;
    bz_BasePlayerRecord *playerRecord = pje->record;
    evPoster->addKeyValuePair("action", "part");
    evPoster->addKeyValuePair("player",  playerRecord->callsign.c_str());
    evPoster->postStuff();

    break;
  }

  case bz_ePlayerSpawnEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_PlayerSpawnEventData_V1* pse = ( bz_PlayerSpawnEventData_V1*)eventData;
    int p = pse->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    char team[7];
    if(pse->team == eRabbitTeam)
      strcpy(team, "rabbit");
    if(pse->team == eHunterTeam)
      strcpy(team, "hunter");
    evPoster->addKeyValuePair("action", "spawn");
    evPoster->addKeyValuePair("player", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("team", team);
    evPoster->postStuff();

    break;


  }

  case bz_eServerMsgEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_ServerMsgEventData_V1* se =(bz_ServerMsgEventData_V1*) eventData;
    int p = se->to;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    evPoster->addKeyValuePair("action", "servermessage");
    evPoster->addKeyValuePair("to", playerRecord->callsign.c_str());
    evPoster->addKeyValuePair("message", se->message.c_str());
    evPoster->postStuff();

    break;
  }

  case bz_eGetAutoTeamEvent: {
    EventPoster* evPoster = new EventPoster();
    epVector.push_back(evPoster);
    bz_GetAutoTeamEventData_V1* at = (bz_GetAutoTeamEventData_V1*) eventData;
    evPoster->addKeyValuePair("action", "autoteam");
    evPoster->addKeyValuePair("player", at->callsign.c_str());
    char team[7];
    if(at->team == eRabbitTeam)
      strcpy(team, "rabbit");
    if(at->team == eHunterTeam)
      strcpy(team, "hunter");
    evPoster->addKeyValuePair("team", team);
    evPoster->postStuff();

    break;

  }

  case bz_ePlayerScoreChanged: {
    bz_PlayerScoreChangeEventData_V1* ps = (bz_PlayerScoreChangeEventData_V1*) eventData;
    int p = ps->playerID;
    bz_BasePlayerRecord *playerRecord = bz_getPlayerByIndex(p);
    if (!playerRecord) break;
    if(playerRecord->team == eRabbitTeam){
        EventPoster* evPoster2 = new EventPoster();
        epVector.push_back(evPoster2);
        evPoster2->addKeyValuePair("action", "israbbit");
        evPoster2->addKeyValuePair("player", playerRecord->callsign.c_str());
        evPoster2->postStuff();
    }
    break;


  }

  }
}

void EventLogger::Init ( const char* /*commandLine*/ )
{
  EventPoster* evPoster = new EventPoster();
  epVector.push_back(evPoster);
  evPoster->addKeyValuePair("action", "start");
  evPoster->postStuff();
  bz_debugMessage(1, "eventlogger initialized");
  // register events for pick up, drop, and fire, kill
  Register(bz_eFlagGrabbedEvent);
  Register(bz_eFlagDroppedEvent);
  Register(bz_eShotFiredEvent);
  Register(bz_ePlayerDieEvent);
  // Register(bz_eGameEndEvent);
  // Register(bz_eGameStartEvent);
  Register(bz_eGetPlayerInfoEvent);
  Register(bz_ePlayerJoinEvent);
  Register(bz_ePlayerPartEvent);
  Register(bz_ePlayerSpawnEvent);
  // Register(bz_eServerMsgEvent);
  // Register(bz_eGetAutoTeamEvent);
  // Register(bz_ePlayerScoreChanged);
}

void EventLogger::Cleanup ( void )
{



  // unregister our events
  Flush();
  bz_debugMessage(1, "eventlogger plugin unloaded");
}

// Local Variables: ***
// mode:C++ ***
// tab-width: 8 ***
// c-basic-offset: 2 ***
// indent-tabs-mode: t ***
// End: ***
// ex: shiftwidth=2 tabstop=8
