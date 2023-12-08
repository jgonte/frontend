using Microsoft.AspNetCore.Mvc;

namespace FrontEnd;

[Route("api/applications")]
[ApiController]
public class ApplicationsController : ControllerBase
{
    private ILogger<ApplicationsController> _logger;

    private ApplicationOutputDto[] _applications = new ApplicationOutputDto[]
        {
            new ApplicationOutputDto
            {
                Id = Guid.Parse("d8092aeb-9aa1-4a3b-932c-76f5ce365648"),
                Type = new ApplicationTypeOutputDto
                {
                    Logo = "http://www.logobook.com/wp-content/uploads/2016/10/woven.svg",
                    Title = "Application 1",
                    Scripts = new ScriptOutputDto[]
                    {
                        new ScriptOutputDto
                        {
                            //Type="module",
                            Source="./js/app1.js"
                        }
                    },
                    Modules = new ModuleOutputDto[]
                    {
                        new ModuleOutputDto
                        {
                            Name="App1Mod1",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    //Type="module",
                                    Source="./js/app1mod1.js"
                                }
                            }
                        },
                        new ModuleOutputDto
                        {
                            Name="App1Mod2",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    //Type="module",
                                    Source="./js/app1mod2.js"
                                }
                            }
                        }
                    },
                    Routes = new RouteOutputDto[]
                    {
                        new RouteOutputDto
                        {
                            Module = "App1",
                            Name = "Dashboards",
                            Path = "/",
                            View = "homePage"
                        },
                        new RouteOutputDto
                        {
                            Module = "App1Mod1",
                            Name = "Manage Users",
                            Path = "/users",
                            View = "usersPage"
                        },
                        new RouteOutputDto
                        {
                            Module = "App1Mod2",
                            Name = "Manage Organizations",
                            Path = "/organizations",
                            View = "organizationsPage"
                        }
                    }
                }

            },
            new ApplicationOutputDto
            {
                Id = Guid.Parse("ffe0139b-2ea9-4c86-a75f-96cfd64a42a6"),
                Type = new ApplicationTypeOutputDto
                {
                    Logo = "http://www.logobook.com/wp-content/uploads/2016/10/norges_rode_kors_logo.svg",
                    Title = "Application 2",
                    Scripts = new ScriptOutputDto[]
                    {
                        new ScriptOutputDto
                        {
                            //Type="module",
                            Source="./js/app2.js"
                        }
                    },
                    Modules = new ModuleOutputDto[]
                    {
                        new ModuleOutputDto
                        {
                            Name="App2Mod1",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    //Type="module",
                                    Source="js/app2mod1.js"
                                }
                            }
                        },
                        new ModuleOutputDto
                        {
                            Name="App2Mod2",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    Type="module",
                                    Source="js/app2mod2.js"
                                }
                            }
                        }
                    },
                    Routes = new RouteOutputDto[]
                    {
                        new RouteOutputDto
                        {
                            Module = "App2Mod1",
                            Path = "/schools",
                            View = "SchoolsList"
                        },
                        new RouteOutputDto
                        {
                            Module = "App2Mod2",
                            Path = "/schedules",
                            View = "SchedulesList"
                        }
                    }
                }
            },
            new ApplicationOutputDto
            {
                Id = Guid.Parse("ad8f8bb4-2a52-4331-96b5-dd1ca1b9a75f"),
                Type = new ApplicationTypeOutputDto
                {
                    Logo = "http://www.logobook.com/wp-content/uploads/2016/01/flugsyningin_1969_logo.svg",
                    Title = "Application 3",
                    Scripts = new ScriptOutputDto[]

                    {
                        new ScriptOutputDto
                        {
                            //Type="module",
                            Source="./js/app3.js"
                        }
                    },
                    Modules = new ModuleOutputDto[]
                    {
                        new ModuleOutputDto
                        {
                            Name="App3Mod1",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    Type="module",
                                    Source=""
                                }
                            }
                        },
                        new ModuleOutputDto
                        {
                            Name="App3Mod2",
                            Scripts = new ScriptOutputDto[]
                            {
                                new ScriptOutputDto
                                {
                                    Type="module",
                                    Source=""
                                }
                            }
                        }
                    },
                    Routes = new RouteOutputDto[]
                    {
                        new RouteOutputDto
                        {
                            Module = "App3Mod1",
                            Path = "/stores",
                            View = "StoresList"
                        },
                        new RouteOutputDto
                        {
                            Module = "App3Mod2",
                            Path = "/products",
                            View = "ProductsList"
                        }
                    }
                }
            }
        };

    public ApplicationsController(ILogger<ApplicationsController> logger)
    {
        _logger = logger;
    }

    // GET: api/applications
    [HttpGet]
    //[Authorize]
    public IEnumerable<ApplicationOutputDto> Get()
    {
        _logger.LogInformation("Getting applications");

        return _applications;
    }

    // GET api/<ContactsController>/5
    [HttpGet("{id}")]
    //[Authorize]
    public ApplicationOutputDto Get(Guid id)
    {
        _logger.LogInformation("Getting Application with id: {id}", id);

        return _applications
            .Where(applications => applications.Id == id)
            .SingleOrDefault();
    }

    // GET: api/applications/links
    [HttpGet("links")]
    //[Authorize]
    public Dictionary<string, LinkOutputDto> GetLinks()
    {
        _logger.LogInformation("Getting application links");

        var links = new Dictionary<string, LinkOutputDto>();

        foreach (var application in _applications)
        {
            links.Add($"/applications/{application.Id}", new LinkOutputDto
            {
                Text = application.Type.Title
            });
        }

        return links;
    }
}
